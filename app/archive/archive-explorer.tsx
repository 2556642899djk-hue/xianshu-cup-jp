"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getEndingNameJa, getOperatorNameJa } from "../data/localization";
import type { PlayerRecord, SeasonMeta } from "../data/types";

type SortMode = "newest" | "oldest" | "score";
type ViewMode = "records" | "players";

type ArchiveExplorerProps = {
  records: PlayerRecord[];
  seasons: SeasonMeta[];
  initialSeasons: number[];
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

const scoreFormatter = new Intl.NumberFormat("ja-JP", {
  maximumFractionDigits: 1,
});

function searchableText(record: PlayerRecord) {
  return [
    record.name,
    record.teamCode,
    record.teamName,
    record.role,
    record.squadCn,
    record.squadJa,
    record.operator,
    getOperatorNameJa(record.operator),
    record.ending,
    getEndingNameJa(record.ending),
  ]
    .join(" ")
    .toLocaleLowerCase("ja-JP");
}

function initials(name: string) {
  return Array.from(name).slice(0, 2).join("");
}

export function ArchiveExplorer({
  records,
  seasons,
  initialSeasons,
}: ArchiveExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedSeasons, setSelectedSeasons] = useState(initialSeasons);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("records");

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ja-JP");
    return records
      .filter((record) => {
        const seasonMatches =
          selectedSeasons.length === 0 || selectedSeasons.includes(record.season);
        const queryMatches =
          normalizedQuery.length === 0 || searchableText(record).includes(normalizedQuery);
        return seasonMatches && queryMatches;
      })
      .sort((a, b) => {
        if (sortMode === "score") {
          return b.score - a.score || b.date.localeCompare(a.date);
        }
        const dateOrder = a.date.localeCompare(b.date);
        return sortMode === "newest"
          ? -dateOrder || b.score - a.score
          : dateOrder || b.score - a.score;
      });
  }, [query, records, selectedSeasons, sortMode]);

  const playerProfiles = useMemo(() => {
    const grouped = new Map<string, PlayerRecord[]>();
    filteredRecords.forEach((record) => {
      const entries = grouped.get(record.name) ?? [];
      entries.push(record);
      grouped.set(record.name, entries);
    });

    return Array.from(grouped, ([name, entries]) => {
      const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
      return {
        name,
        entries: sortedEntries,
        latest: sortedEntries[0],
        avatar: sortedEntries.find((entry) => entry.avatar)?.avatar,
        seasons: Array.from(new Set(entries.map((entry) => entry.season))).sort(
          (a, b) => a - b,
        ),
      };
    }).sort(
      (a, b) =>
        b.entries.length - a.entries.length || a.name.localeCompare(b.name, "zh-CN"),
    );
  }, [filteredRecords]);

  const resultCount =
    viewMode === "records" ? filteredRecords.length : playerProfiles.length;

  function toggleSeason(season: number) {
    setSelectedSeasons((current) =>
      current.includes(season)
        ? current.filter((item) => item !== season)
        : [...current, season].sort((a, b) => a - b),
    );
  }

  function clearFilters() {
    setQuery("");
    setSelectedSeasons([]);
    setSortMode("newest");
  }

  return (
    <section className="archive-explorer section-shell" aria-label="選手記録検索">
      <div className="archive-toolbar">
        <div className="archive-toolbar__topline">
          <div className="view-switch" aria-label="表示切替">
            <button
              type="button"
              className={viewMode === "records" ? "is-active" : ""}
              onClick={() => setViewMode("records")}
              aria-pressed={viewMode === "records"}
            >
              参戦記録 <span>RUNS</span>
            </button>
            <button
              type="button"
              className={viewMode === "players" ? "is-active" : ""}
              onClick={() => setViewMode("players")}
              aria-pressed={viewMode === "players"}
            >
              選手一覧 <span>PLAYERS</span>
            </button>
          </div>
          <p className="result-count" aria-live="polite">
            <strong>{resultCount}</strong> {viewMode === "records" ? "RECORDS" : "PLAYERS"}
          </p>
        </div>

        <div className="archive-toolbar__controls">
          <label className="search-field">
            <span className="sr-only">アーカイブを検索</span>
            <span className="search-field__icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="選手・チーム・分隊・オペレーターを検索"
            />
          </label>

          <label className="sort-field">
            <span>並び順</span>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="score">得点順</option>
            </select>
          </label>
        </div>

        <div className="season-filters" aria-label="届次で絞り込む">
          <span className="season-filters__label">CUP</span>
          <button
            type="button"
            className={selectedSeasons.length === 0 ? "is-active" : ""}
            onClick={() => setSelectedSeasons([])}
            aria-pressed={selectedSeasons.length === 0}
          >
            ALL
          </button>
          {seasons.map((season) => (
            <button
              type="button"
              key={season.season}
              className={selectedSeasons.includes(season.season) ? "is-active" : ""}
              onClick={() => toggleSeason(season.season)}
              aria-pressed={selectedSeasons.includes(season.season)}
            >
              #{season.season}
            </button>
          ))}
          {(query || selectedSeasons.length > 0 || sortMode !== "newest") && (
            <button className="season-filters__clear" type="button" onClick={clearFilters}>
              クリア ×
            </button>
          )}
        </div>
      </div>

      {resultCount === 0 ? (
        <div className="archive-empty">
          <span>NO MATCH</span>
          <h2>該当する記録が見つかりません</h2>
          <p>検索語または届次フィルターを変更してください。</p>
          <button className="button button--ghost" type="button" onClick={clearFilters}>
            フィルターをリセット
          </button>
        </div>
      ) : viewMode === "records" ? (
        <div className="record-grid">
          {filteredRecords.map((record) => (
            <RecordCard key={`${record.season}-${record.id}`} record={record} />
          ))}
        </div>
      ) : (
        <div className="player-grid">
          {playerProfiles.map((profile) => (
            <article className="player-profile" key={profile.name}>
              <div className="player-profile__avatar">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={`${profile.name}のアバター`}
                    width={112}
                    height={112}
                  />
                ) : (
                  <span>{initials(profile.name)}</span>
                )}
              </div>
              <div className="player-profile__body">
                <div className="player-profile__meta">
                  <span>{profile.entries.length} APPEARANCES</span>
                  <span>{profile.seasons.map((season) => `#${season}`).join(" · ")}</span>
                </div>
                <h2>{profile.name}</h2>
                <p>
                  <b>{profile.latest.teamCode}</b> · {profile.latest.teamName}
                </p>
                <div className="player-profile__links">
                  <a
                    href={profile.latest.bilibiliUrl ?? profile.latest.bilibiliSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Bilibili <span aria-hidden="true">↗</span>
                  </a>
                  <a href={profile.latest.matchVideoUrl} target="_blank" rel="noreferrer">
                    最新記録 <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function RecordCard({ record }: { record: PlayerRecord }) {
  return (
    <article className={`record-card record-card--season-${record.season}`}>
      <header className="record-card__header">
        <div className="record-card__avatar">
          {record.avatar ? (
            <Image
              src={record.avatar}
              alt={`${record.name}のアバター`}
              width={72}
              height={72}
            />
          ) : (
            <span>{initials(record.name)}</span>
          )}
        </div>
        <div className="record-card__identity">
          <p>
            CUP #{record.season} <span>/</span> DAY {record.day}
          </p>
          <h2>{record.name}</h2>
          <span>
            {record.teamCode} · {record.teamName} · {record.role}
          </span>
        </div>
        <time dateTime={record.date}>{dateFormatter.format(new Date(`${record.date}T00:00:00Z`))}</time>
      </header>

      <div className="record-card__facts">
        <div>
          <span>選択分隊 / SQUAD</span>
          <b>{record.squadJa}</b>
          <small>CN · {record.squadCn}</small>
        </div>
        <div>
          <span>初手 / START</span>
          <b>{getOperatorNameJa(record.operator)}</b>
        </div>
        <div className="record-card__ending">
          <span>達成結末 / ENDING</span>
          <b>{getEndingNameJa(record.ending)}</b>
        </div>
      </div>

      <div className="record-card__score">
        <span>{record.scoreLabel}</span>
        <strong>{scoreFormatter.format(record.score)}</strong>
      </div>

      <footer className="record-card__footer">
        <span
          className={`status-badge ${
            record.matchVideoStatus === "verified" ? "is-verified" : "is-review"
          }`}
        >
          <i aria-hidden="true" />
          {record.matchVideoStatus === "verified" ? "録画確認済" : "録画リンク・要確認"}
        </span>
        <div>
          <a
            href={record.bilibiliUrl ?? record.bilibiliSearchUrl}
            target="_blank"
            rel="noreferrer"
          >
            選手ページ ↗
          </a>
          <a href={record.matchVideoUrl} target="_blank" rel="noreferrer">
            大会録画 ↗
          </a>
          <a href={record.sourceUrl} target="_blank" rel="noreferrer">
            出典 ↗
          </a>
        </div>
      </footer>
    </article>
  );
}
