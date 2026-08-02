import type { Metadata } from "next";
import { ArchiveExplorer } from "./archive-explorer";
import { records, seasons } from "../data/archive";

export const metadata: Metadata = {
  title: "選手アーカイブ #3—#8",
  description:
    "仙術杯第3回〜第8回、138件の参戦記録を選手・チーム・分隊・初手・結末から検索できます。",
};

type ArchivePageProps = {
  searchParams: Promise<{ season?: string | string[] }>;
};

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const params = await searchParams;
  const seasonParam = Array.isArray(params.season) ? params.season[0] : params.season;
  const validSeasons = new Set(seasons.map((season) => season.season));
  const initialSeasons = (seasonParam ?? "")
    .split(",")
    .map(Number)
    .filter((season) => validSeasons.has(season));

  return (
    <main id="main-content" className="archive-page">
      <section className="archive-hero section-shell">
        <div>
          <p className="eyebrow">PLAYER &amp; RUN ARCHIVE / #03—#08</p>
          <h1>
            選手アーカイブ
            <span>仙术杯选手档案</span>
          </h1>
          <p>
            2023—2026年の公開大会記録をひとつの時系列に統合。
            選手、チーム、分隊、初手、結末、得点を横断検索できます。
          </p>
        </div>
        <div className="archive-hero__number" aria-hidden="true">
          <span>ARCHIVE</span>
          <strong>138</strong>
          <small>PUBLIC RUNS</small>
        </div>
      </section>

      <div className="archive-disclaimer">
        <div className="section-shell">
          <span>STATUS /</span>
          <p>
            録画リンクは該当分集へ接続済みですが、現在は全件人工確認待ちです。
            得点体系は届次ごとに異なるため、単純比較にはご注意ください。
          </p>
        </div>
      </div>

      <ArchiveExplorer
        records={records}
        seasons={seasons}
        initialSeasons={initialSeasons}
      />
    </main>
  );
}
