import type { Metadata } from "next";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://xianshu-cup-jp-joui.vercel.app"),
  title: {
    default: "仙術杯 JP Archive",
    template: "%s | 仙術杯 JP Archive",
  },
  description:
    "中国アークナイツ統合戦略コミュニティ大会『仙術杯』第3回〜第8回の選手・チーム・分隊・初手・結末・得点を横断できる日本語アーカイブ。",
  openGraph: {
    title: "仙術杯 JP Archive",
    description: "仙術杯 #3—#8 をひとつの記録へ。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <a className="skip-link" href="#main-content">
          コンテンツへ移動
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
