"""Fill missing roster avatars from public Bilibili profile data.

The script first reuses avatars already attached to the same player name or UID.
It then fetches profiles for UIDs already present in the roster. With
``--search-exact``, records that only have a Bilibili search link are resolved
only when the public user search returns exactly one case-sensitive name match.
"""

from __future__ import annotations

import argparse
import html as html_module
import http.cookiejar
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

from import_roster import convert_avatar


UID_RE = re.compile(r"space\.bilibili\.com/(\d+)")
TAG_RE = re.compile(r"<[^>]+>")
CARD_API = "https://api.bilibili.com/x/web-interface/card?mid={}"
SEARCH_API = "https://api.bilibili.com/x/web-interface/search/type?{}"
KNOWN_NAME_ALIASES = {
    "门萨鸭（巅峰巫恋）": "门萨鸭",
}


class BilibiliClient:
    def __init__(self, delay: float) -> None:
        self.delay = delay
        cookie_jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(cookie_jar),
        )
        self.warm_up()

    def request(self, url: str, referer: str, *, attempts: int = 3) -> bytes:
        headers = {
            "Accept": "application/json,text/plain,*/*",
            "Accept-Language": "zh-CN,zh;q=0.9,ja;q=0.8,en;q=0.7",
            "Referer": referer,
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/138.0.0.0 Safari/537.36"
            ),
        }

        for attempt in range(attempts):
            try:
                request = urllib.request.Request(url, headers=headers)
                with self.opener.open(request, timeout=30) as response:
                    payload = response.read()
                time.sleep(self.delay)
                return payload
            except urllib.error.HTTPError as error:
                if error.code != 412 or attempt == attempts - 1:
                    raise
                time.sleep(max(2.0, self.delay * (attempt + 2)))
                self.warm_up()

        raise RuntimeError(f"Request failed: {url}")

    def json(self, url: str, referer: str) -> dict[str, Any]:
        return json.loads(self.request(url, referer).decode("utf-8"))

    def warm_up(self) -> None:
        request = urllib.request.Request(
            "https://www.bilibili.com/",
            headers={"User-Agent": "Mozilla/5.0"},
        )
        try:
            with self.opener.open(request, timeout=30):
                pass
        except urllib.error.URLError:
            pass


def record_uid(record: dict[str, Any]) -> str | None:
    url = record.get("bilibiliUrl")
    if not isinstance(url, str):
        return None
    match = UID_RE.search(url)
    return match.group(1) if match else None


def clean_name(value: Any) -> str:
    return html_module.unescape(TAG_RE.sub("", str(value))).strip()


def get_profile(client: BilibiliClient, uid: str) -> dict[str, str] | None:
    response = client.json(CARD_API.format(uid), f"https://space.bilibili.com/{uid}")
    if response.get("code") != 0:
        return None
    card = (response.get("data") or {}).get("card") or {}
    face = str(card.get("face") or "")
    if face.startswith("//"):
        face = f"https:{face}"
    if not face.startswith("http"):
        return None
    return {
        "uid": str(card.get("mid") or uid),
        "name": clean_name(card.get("name") or ""),
        "face": face,
    }


def search_exact_uid(client: BilibiliClient, name: str) -> str | None:
    query = urllib.parse.urlencode(
        {"search_type": "bili_user", "page": 1, "keyword": name},
    )
    response = client.json(
        SEARCH_API.format(query),
        f"https://search.bilibili.com/upuser?keyword={urllib.parse.quote(name)}",
    )
    if response.get("code") != 0:
        return None
    results = ((response.get("data") or {}).get("result") or [])
    exact_matches = [item for item in results if clean_name(item.get("uname")) == name]
    if len(exact_matches) != 1:
        return None
    return str(exact_matches[0].get("mid") or "") or None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--project-root",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="Next.js project root",
    )
    parser.add_argument(
        "--search-exact",
        action="store_true",
        help="Search Bilibili for an exact account-name match when no UID exists",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="Delay between Bilibili requests in seconds",
    )
    args = parser.parse_args()

    project_root = args.project_root.resolve()
    data_path = project_root / "app" / "data" / "players.json"
    avatar_dir = project_root / "public" / "avatars"
    records: list[dict[str, Any]] = json.loads(data_path.read_text(encoding="utf-8"))

    avatar_by_name: dict[str, str] = {}
    avatar_by_uid: dict[str, str] = {}
    uids_by_name: dict[str, set[str]] = {}
    for record in records:
        name = str(record["name"])
        uid = record_uid(record)
        if uid:
            uids_by_name.setdefault(name, set()).add(uid)
        avatar = record.get("avatar")
        if not isinstance(avatar, str) or not avatar:
            continue
        avatar_by_name.setdefault(name, avatar)
        if uid:
            avatar_by_uid.setdefault(uid, avatar)

    reused = 0
    for record in records:
        if record.get("avatar"):
            continue
        name = str(record["name"])
        uid = record_uid(record)
        alias_name = KNOWN_NAME_ALIASES.get(name)
        alias_uids = sorted(uids_by_name.get(alias_name, set())) if alias_name else []
        avatar = (
            avatar_by_name.get(name)
            or (avatar_by_uid.get(uid) if uid else None)
            or (avatar_by_name.get(alias_name) if alias_name else None)
        )
        if avatar:
            record["avatar"] = avatar
            avatar_by_name.setdefault(name, avatar)
            if uid:
                avatar_by_uid.setdefault(uid, avatar)
            elif len(alias_uids) == 1:
                record["bilibiliUrl"] = f"https://space.bilibili.com/{alias_uids[0]}"
            reused += 1

    unresolved_names = sorted(
        {
            str(record["name"])
            for record in records
            if not record.get("avatar")
        },
        key=str.casefold,
    )

    has_known_uid_to_fetch = any(
        record_uid(record)
        for record in records
        if not record.get("avatar")
    )
    client = (
        BilibiliClient(max(args.delay, 0.4))
        if args.search_exact or has_known_uid_to_fetch
        else None
    )
    imported_profiles: list[dict[str, str]] = []
    skipped: list[str] = []

    for name in unresolved_names:
        matching_records = [record for record in records if record["name"] == name]
        uids = sorted({uid for record in matching_records if (uid := record_uid(record))})

        if not uids and args.search_exact:
            assert client is not None
            try:
                found_uid = search_exact_uid(client, name)
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
                print(f"SEARCH ERROR {name}: {error}")
                found_uid = None
            if found_uid:
                uids = [found_uid]

        if len(uids) != 1:
            skipped.append(name)
            print(f"SKIP {name}: no unambiguous UID")
            continue

        uid = uids[0]
        assert client is not None
        try:
            profile = get_profile(client, uid)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
            skipped.append(name)
            print(f"PROFILE ERROR {name} / {uid}: {error}")
            continue
        if profile is None:
            skipped.append(name)
            print(f"SKIP {name}: profile {uid} has no usable avatar")
            continue

        try:
            raw_avatar = client.request(
                profile["face"],
                f"https://space.bilibili.com/{uid}",
            )
            local_avatar = convert_avatar(raw_avatar, avatar_dir)
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            skipped.append(name)
            print(f"AVATAR ERROR {name} / {uid}: {error}")
            continue

        for record in matching_records:
            record["avatar"] = local_avatar
            if not record.get("bilibiliUrl"):
                record["bilibiliUrl"] = f"https://space.bilibili.com/{uid}"

        avatar_by_name[name] = local_avatar
        avatar_by_uid[uid] = local_avatar
        imported_profiles.append(
            {
                "rosterName": name,
                "profileName": profile["name"],
                "uid": uid,
                "avatar": local_avatar,
            },
        )
        print(f"OK {name} -> {profile['name']} / {uid} / {local_avatar}")

    data_path.write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    remaining_records = sum(1 for record in records if not record.get("avatar"))
    remaining_names = len({record["name"] for record in records if not record.get("avatar")})
    print(f"Reused existing avatars for {reused} records")
    print(f"Imported {len(imported_profiles)} public Bilibili profiles")
    print(f"Remaining without avatar: {remaining_records} records / {remaining_names} names")
    if skipped:
        print("Skipped names: " + ", ".join(skipped))


if __name__ == "__main__":
    main()
