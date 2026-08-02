import Link from "next/link";

const githubUrl = "https://github.com/2556642899djk-hue/xianshu-cup-jp";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="仙術杯 JP Archive ホーム">
          <span className="brand__mark" aria-hidden="true">
            XS
          </span>
          <span className="brand__name">
            仙術杯 <b>JP ARCHIVE</b>
          </span>
        </Link>

        <nav className="site-nav" aria-label="メインナビゲーション">
          <Link href="/">ホーム</Link>
          <Link href="/archive">選手アーカイブ</Link>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
