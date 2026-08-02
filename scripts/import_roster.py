"""Import the portable Xianshu Cup roster into the Next.js project.

The source HTML contains a JavaScript ``DATA`` array and embeds many avatars as
data URIs. This script extracts the records, deduplicates the avatars, converts
them to small WebP files, and writes JSON that can be imported by the app.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import re
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps


DATA_MARKER = "const DATA="
DATA_URI_RE = re.compile(r"^data:image/[^;]+;base64,(.+)$", re.DOTALL)


def extract_data_array(html: str) -> list[dict[str, object]]:
    marker_index = html.find(DATA_MARKER)
    if marker_index < 0:
        raise ValueError("Could not find the roster DATA array")

    start = html.find("[", marker_index + len(DATA_MARKER))
    if start < 0:
        raise ValueError("Could not find the start of the roster DATA array")

    depth = 0
    in_string = False
    escaped = False
    end = -1

    for index in range(start, len(html)):
        char = html[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
        elif char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                end = index + 1
                break

    if end < 0:
        raise ValueError("Could not find the end of the roster DATA array")

    records = json.loads(html[start:end])
    if not isinstance(records, list):
        raise TypeError("Roster DATA must be a JSON array")
    return records


def load_avatar(source: str, download_remote: bool) -> bytes | None:
    match = DATA_URI_RE.match(source)
    if match:
        return base64.b64decode(match.group(1))

    if source.startswith(("https://", "http://")) and download_remote:
        request = urllib.request.Request(
            source,
            headers={"User-Agent": "XianshuCupJP-ArchiveImporter/1.0"},
        )
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.read()

    return None


def convert_avatar(raw: bytes, output_dir: Path) -> str:
    digest = hashlib.sha256(raw).hexdigest()[:16]
    filename = f"{digest}.webp"
    output_path = output_dir / filename

    if not output_path.exists():
        with Image.open(io.BytesIO(raw)) as image:
            image = ImageOps.exif_transpose(image)
            image.thumbnail((320, 320), Image.Resampling.LANCZOS)
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "transparency" in image.info else "RGB")
            image.save(output_path, "WEBP", quality=82, method=6)

    return f"/avatars/{filename}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Portable roster HTML file")
    parser.add_argument(
        "--project-root",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="Next.js project root",
    )
    parser.add_argument(
        "--download-remote",
        action="store_true",
        help="Download remote avatars so every image is served locally",
    )
    args = parser.parse_args()

    source = args.source.resolve()
    project_root = args.project_root.resolve()
    data_dir = project_root / "app" / "data"
    avatar_dir = project_root / "public" / "avatars"
    data_dir.mkdir(parents=True, exist_ok=True)
    avatar_dir.mkdir(parents=True, exist_ok=True)

    records = extract_data_array(source.read_text(encoding="utf-8"))
    avatar_cache: dict[str, str] = {}
    imported = 0

    for record in records:
        avatar = record.get("avatar")
        if not isinstance(avatar, str) or not avatar:
            continue

        if avatar in avatar_cache:
            record["avatar"] = avatar_cache[avatar]
            continue

        raw = load_avatar(avatar, args.download_remote)
        if raw is None:
            continue

        local_path = convert_avatar(raw, avatar_dir)
        avatar_cache[avatar] = local_path
        record["avatar"] = local_path
        imported += 1

    output_path = data_dir / "players.json"
    output_path.write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Imported {len(records)} records")
    print(f"Created or reused {imported} unique local avatars")
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
