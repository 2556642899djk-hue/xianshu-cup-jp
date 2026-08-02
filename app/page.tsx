import Image from "next/image";
import Link from "next/link";
import { records, seasons, themes } from "./data/archive";

const uniquePlayers = new Set(records.map((record) => record.name)).size;
const uniqueDays = new Set(records.map((record) => record.date)).size;

const seasonRows = seasons.map((season) => {
  const seasonRecords = records.filter((record) => record.season === season.season);
  return {
    ...season,
    recordCount: seasonRecords.length,
    playerCount: new Set(seasonRecords.map((record) => record.name)).size,
  };
});

export default function Home() {
  return (
    <main id="main-content">
      <section className="home-hero section-shell">
        <div className="home-hero__copy">
          <p className="eyebrow">COMMUNITY TOURNAMENT ARCHIVE / 2023—2026</p>
          <h1 className="display-heading">
            仙術杯を、
            <span>ひとつの記録へ。</span>
          </h1>
          <p className="home-hero__lead">
            中国『アークナイツ』統合戦略コミュニティ大会「仙術杯」の第3回から第8回までを、
            日本語で横断できる非公式アーカイブです。
          </p>
          <p className="home-hero__cn">
            收录仙术杯第 3—8 届公开赛事资料，连接选手、队伍与每一场值得记住的挑战。
          </p>
          <div className="button-row">
            <Link className="button button--primary" href="/archive">
              選手アーカイブを見る <span aria-hidden="true">→</span>
            </Link>
            <a
              className="button button--ghost"
              href="https://github.com/2556642899djk-hue/xianshu-cup-jp"
              target="_blank"
              rel="noreferrer"
            >
              GitHubで編集する <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="home-hero__index" aria-label="収録範囲 第3回から第8回">
          <span className="home-hero__hash">#</span>
          <span className="home-hero__range">03—08</span>
          <span className="home-hero__stamp">UNOFFICIAL / JP LOCALIZATION</span>
        </div>
      </section>

      <section className="stats-strip" aria-label="アーカイブ統計">
        <div className="stat">
          <strong>{records.length}</strong>
          <span>RECORDS</span>
          <small>赛事记录</small>
        </div>
        <div className="stat">
          <strong>{uniquePlayers}</strong>
          <span>PLAYERS</span>
          <small>不同选手名</small>
        </div>
        <div className="stat">
          <strong>6</strong>
          <span>SEASONS</span>
          <small>第 3—8 届</small>
        </div>
        <div className="stat">
          <strong>{uniqueDays}</strong>
          <span>MATCH DAYS</span>
          <small>公开比赛日</small>
        </div>
      </section>

      <section className="section-shell section-block" id="themes">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / THE FOUR EXPEDITIONS</p>
            <h2>4つの統合戦略、6回の仙術杯</h2>
          </div>
          <p>
            水月、サーミ、サルカズ、歳。テーマごとに大会をたどり、各回の全記録へ移動できます。
          </p>
        </div>

        <div className="theme-grid">
          {themes.map((theme, index) => (
            <Link
              className={`theme-card theme-card--${theme.accent}`}
              href={theme.href}
              key={theme.id}
            >
              <Image
                src={theme.image}
                alt={`${theme.titleJa} / ${theme.titleCn}`}
                fill
                priority={index < 2}
                sizes="(max-width: 760px) 100vw, 50vw"
              />
              <span className="theme-card__veil" aria-hidden="true" />
              <span className="theme-card__label">{theme.label}</span>
              <span className="theme-card__content">
                <small>{theme.cups}</small>
                <strong>{theme.title}</strong>
                <span>{theme.titleJa}</span>
                <em>{theme.titleCn}</em>
              </span>
              <span className="theme-card__arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell section-block ledger-section">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="eyebrow">02 / SEASON LEDGER</p>
            <h2>届次から探す</h2>
          </div>
          <Link className="text-link" href="/archive">
            すべての記録 <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="season-ledger" role="table" aria-label="仙術杯届次一覧">
          <div className="season-ledger__head" role="row">
            <span role="columnheader">CUP</span>
            <span role="columnheader">THEME</span>
            <span role="columnheader">DATE</span>
            <span role="columnheader">FORMAT</span>
            <span role="columnheader">RECORDS</span>
            <span aria-hidden="true" />
          </div>
          {seasonRows.map((season) => (
            <Link
              className={`season-ledger__row accent-${season.accent}`}
              href={`/archive?season=${season.season}`}
              key={season.season}
              role="row"
            >
              <span className="season-ledger__cup" role="cell">
                #{String(season.season).padStart(2, "0")}
              </span>
              <span role="cell">
                <b>{season.shortTheme}</b>
                <small>{season.themeJa}</small>
              </span>
              <span role="cell">{season.period}</span>
              <span role="cell">{season.format}</span>
              <span role="cell">
                {season.recordCount} <small>RUNS</small>
              </span>
              <span className="season-ledger__open" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell section-block archive-notes">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / ARCHIVE POLICY</p>
            <h2>未確認も、明記して残す。</h2>
          </div>
          <p>
            完成した百科事典ではなく、出典と確認状況が見える共同アーカイブとして運用します。
          </p>
        </div>

        <div className="note-grid">
          <article>
            <span>01</span>
            <h3>公開資料を再整理</h3>
            <p>大会ページ、公開動画、選手ページなど、誰でも確認できる情報を届次横断で整理します。</p>
          </article>
          <article>
            <span>02</span>
            <h3>録画リンクは確認中</h3>
            <p>現在の138件は該当分集へ接続済みですが、すべて「要確認」として明示しています。</p>
          </article>
          <article>
            <span>03</span>
            <h3>翻訳は段階的に追加</h3>
            <p>用語、字幕、名場面の翻訳リンクは、検証できたものから記録へ追加していきます。</p>
          </article>
        </div>
      </section>

      <section className="archive-cta section-shell">
        <div>
          <p className="eyebrow">OPEN THE FULL LEDGER</p>
          <h2>138件の挑戦を、横断検索。</h2>
          <p>選手名、チーム、分隊、初手オペレーター、達成結末から検索できます。</p>
        </div>
        <Link className="button button--primary" href="/archive">
          アーカイブを開く <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
