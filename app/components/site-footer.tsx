import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <p className="eyebrow">XIANSHU CUP / COMMUNITY ARCHIVE</p>
          <p className="site-footer__title">記録をつなぎ、文化を届ける。</p>
          <p className="site-footer__cn">连接赛事记录，把社区文化带到更远的地方。</p>
        </div>

        <div className="site-footer__links">
          <Link href="/">ホーム</Link>
          <Link href="/archive">選手アーカイブ</Link>
          <a
            href="https://github.com/2556642899djk-hue/xianshu-cup-jp"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <a href="https://tomimi.dev/ja" target="_blank" rel="noreferrer">
            tomimi.dev ↗
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>UNOFFICIAL FAN ARCHIVE</span>
        <span>DATA UPDATED · 2026.07.28</span>
      </div>
    </footer>
  );
}
