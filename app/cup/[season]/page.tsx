import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeasonMeta, getSeasonRecords, seasons } from "../../data/archive";
import type { PlayerRecord } from "../../data/types";
import styles from "./page.module.css";

type CupPageProps = {
  params: Promise<{ season: string }>;
};

const designs = {
  cyan: {
    image: "/images/mizuki.png",
    code: "TIDAL OBSERVATION",
    label: "DEEP BLUE ARCHIVE",
    description: "潮汐観測ログと深藍の航路をモチーフにした、水月テーマの大会記録。",
  },
  ice: {
    image: "/images/sami.png",
    code: "POLAR EXPEDITION",
    label: "FROST INDEX",
    description: "氷原調査票と極地座標をモチーフにした、サーミテーマの大会記録。",
  },
  amber: {
    image: "/images/sarkaz.png",
    code: "HEARTH SIGNAL",
    label: "FIELD TERMINAL",
    description: "炉辺の信号と警戒端末をモチーフにした、サルカズテーマの大会記録。",
  },
  rose: {
    image: "/images/kaienn.png",
    code: "SUI ANOMALY",
    label: "界園観測録",
    description: "界園の巻物と朱印をモチーフにした、歳テーマの大会記録。",
  },
} as const;

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  timeZone: "UTC",
});

const scoreFormatter = new Intl.NumberFormat("ja-JP", {
  maximumFractionDigits: 1,
});

function parseSeason(value: string) {
  const season = Number(value);
  return Number.isInteger(season) ? season : null;
}

function initials(name: string) {
  return Array.from(name).slice(0, 2).join("");
}

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function sortRecords(records: PlayerRecord[]) {
  return [...records].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.day - b.day ||
      a.id.localeCompare(b.id, "en"),
  );
}

function groupByDate(records: PlayerRecord[]) {
  const groups: Array<{ date: string; day: number; entries: PlayerRecord[] }> = [];

  records.forEach((record) => {
    const current = groups.at(-1);
    if (!current || current.date !== record.date) {
      groups.push({ date: record.date, day: record.day, entries: [record] });
      return;
    }
    current.entries.push(record);
  });

  return groups;
}

export function generateStaticParams() {
  return seasons.map((season) => ({ season: String(season.season) }));
}

export async function generateMetadata({ params }: CupPageProps): Promise<Metadata> {
  const season = parseSeason((await params).season);
  const meta = season === null ? undefined : getSeasonMeta(season);

  if (!meta) {
    return { title: "大会专题" };
  }

  return {
    title: `仙術杯 #${meta.season} · ${meta.themeJa}`,
    description: `仙術杯第${meta.season}届专题页。${meta.themeJa}赛事记录按比赛日期排列。`,
  };
}

export default async function CupPage({ params }: CupPageProps) {
  const seasonNumber = parseSeason((await params).season);
  const meta = seasonNumber === null ? undefined : getSeasonMeta(seasonNumber);

  if (!meta) {
    notFound();
  }

  const design = designs[meta.accent];
  const sortedRecords = sortRecords(getSeasonRecords(meta.season));
  const timeline = groupByDate(sortedRecords);
  const sequenceById = new Map(
    sortedRecords.map((record, index) => [record.id, index + 1]),
  );
  const uniquePlayers = new Set(sortedRecords.map((record) => record.name)).size;
  const uniqueTeams = new Set(sortedRecords.map((record) => record.teamCode)).size;
  const currentIndex = seasons.findIndex((item) => item.season === meta.season);
  const previous = seasons[currentIndex - 1];
  const next = seasons[currentIndex + 1];

  return (
    <main
      className={`${styles.page} ${styles[meta.accent]}`}
      data-cup-season={meta.season}
      id="main-content"
    >
      <section className={`${styles.hero} section-shell`}>
        <div className={styles.heroVisual}>
          <Image
            className={styles.heroImage}
            src={design.image}
            alt={`${meta.themeJa} / ${meta.themeCn}`}
            fill
            priority
            quality={94}
            sizes="(max-width: 1480px) 90vw, 1320px"
          />
          <span className={styles.heroTint} aria-hidden="true" />
          <div className={styles.heroCoordinate}>
            <span>{design.label}</span>
            <b>IS / {meta.shortTheme}</b>
          </div>
          <div className={styles.heroSerial} aria-hidden="true">
            {String(meta.season).padStart(2, "0")}
          </div>
        </div>

        <div className={styles.heroDeck}>
          <div className={styles.heroCopy}>
            <p>{design.code} / EVENT SPECIAL</p>
            <h1>
              <span>仙術杯</span> #{String(meta.season).padStart(2, "0")}
            </h1>
            <h2>{meta.themeJa}</h2>
            <p className={styles.heroCn}>{meta.themeCn}</p>
            <p className={styles.heroDescription}>{design.description}</p>
          </div>

          <div className={styles.heroStats} aria-label="大会概要">
            <div>
              <strong>{sortedRecords.length}</strong>
              <span>RECORDS</span>
            </div>
            <div>
              <strong>{uniquePlayers}</strong>
              <span>PLAYERS</span>
            </div>
            <div>
              <strong>{timeline.length}</strong>
              <span>MATCH DAYS</span>
            </div>
            <div>
              <strong>{uniqueTeams}</strong>
              <span>TEAMS</span>
            </div>
          </div>
        </div>

        <nav className={styles.seasonNav} aria-label="仙術杯届次切替">
          <span>EVENT INDEX</span>
          {seasons.map((season) => (
            <Link
              className={season.season === meta.season ? styles.activeSeason : undefined}
              href={`/cup/${season.season}`}
              key={season.season}
              aria-current={season.season === meta.season ? "page" : undefined}
            >
              #{String(season.season).padStart(2, "0")}
              <small>{season.shortTheme}</small>
            </Link>
          ))}
          <Link className={styles.archiveLink} href={`/archive?season=${meta.season}`}>
            FILTER VIEW ↗
          </Link>
        </nav>
      </section>

      <section className={`${styles.timelineSection} section-shell`}>
        <header className={styles.timelineHeading}>
          <div>
            <p>CHRONOLOGICAL RUN LOG / {meta.period}</p>
            <h2>比赛时间顺序</h2>
          </div>
          <p>
            公開記録を日付の古い順に整理しています。同日の記録は大会資料上の掲載順です。
          </p>
        </header>

        <div className={styles.timeline}>
          {timeline.map((group, groupIndex) => (
            <section
              className={styles.dayGroup}
              data-timeline-date={group.date}
              key={group.date}
            >
              <header className={styles.dayHeader}>
                <div>
                  <span>DAY {String(group.day).padStart(2, "0")}</span>
                  <time dateTime={group.date}>{formatDate(group.date)}</time>
                </div>
                <strong>{String(groupIndex + 1).padStart(2, "0")}</strong>
              </header>
              <div className={styles.cardGrid}>
                {group.entries.map((record) => (
                  <CupRecordCard
                    key={`${record.season}-${record.id}`}
                    record={record}
                    sequence={sequenceById.get(record.id) ?? 0}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <nav className={`${styles.eventPager} section-shell`} aria-label="前後の大会">
        {previous ? (
          <Link href={`/cup/${previous.season}`}>
            <span>← PREVIOUS EVENT</span>
            <strong>#{previous.season} · {previous.shortTheme}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/cup/${next.season}`}>
            <span>NEXT EVENT →</span>
            <strong>#{next.season} · {next.shortTheme}</strong>
          </Link>
        ) : (
          <Link href="/archive">
            <span>FULL INDEX →</span>
            <strong>PLAYER ARCHIVE</strong>
          </Link>
        )}
      </nav>
    </main>
  );
}

function CupRecordCard({ record, sequence }: { record: PlayerRecord; sequence: number }) {
  return (
    <article
      className={styles.runCard}
      data-cup-record
      data-record-date={record.date}
      data-record-sequence={sequence}
    >
      <header className={styles.cardHeader}>
        <div className={styles.avatar}>
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
        <div className={styles.identity}>
          <p>{record.teamCode} / {record.role}</p>
          <h3>{record.name}</h3>
          <span>{record.teamName}</span>
        </div>
        <span className={styles.sequence}>{String(sequence).padStart(2, "0")}</span>
      </header>

      <div className={styles.cardFacts}>
        <div>
          <span>SQUAD / 分隊</span>
          <b>{record.squadJa}</b>
          <small>{record.squadCn}</small>
        </div>
        <div>
          <span>START / 初手</span>
          <b>{record.operator}</b>
        </div>
        <div>
          <span>ENDING / 結末</span>
          <b>{record.ending}</b>
        </div>
      </div>

      <div className={styles.cardScore}>
        <span>{record.scoreLabel}</span>
        <strong>{scoreFormatter.format(record.score)}</strong>
      </div>

      <footer className={styles.cardFooter}>
        <span className={styles.status}>
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
