import Link from "next/link";


const cups = [
  {
    name: "Mizuki Cup",
    desc: "ミズキ統合戦略（仙術杯#3）をテーマにした仙術杯の大会アーカイブおよび翻訳コンテンツ。",
    href: "/mizuki",
    image: "/images/mizuki.png"
  },
  {
    name: "Sami Cup",
    desc: "サーミ統合戦略（仙術杯#4・#5）をテーマにした仙術杯の大会アーカイブおよび翻訳コンテンツ。",
    href: "/sami",
    image: "/images/sami.png"
  },
  {
    name: "Sarkaz Cup",
    desc: "サルカズ統合戦略（仙術杯#6・#7）をテーマにした仙術杯の大会アーカイブおよび翻訳コンテンツ。",
    href: "/sarkaz",
    image: "/images/sarkaz.png"
  }
];
export default function Home() {
  return (
    <main className="min-h-screen text-white relative overflow-hidden bg-gradient-to-b from-zinc-950 via-black to-zinc-950">

  {/* 光效 */}
  <div className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] bg-pink-500/20 blur-[120px] rounded-full" />
  <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />



      {/* Hero Section */}
      <section className="px-10 py-24 border-b border-gray-800">

        <h1 className="text-7xl font-bold text-pink-200 mb-4 leading-tight">
          仙術杯日本語化計画
        </h1>

        <div className="mb-10 space-y-2">
          <p className="text-lg text-pink-300">
            中国明日方舟集成战略社区赛事翻译企划
          </p>

          <p className="text-base text-gray-500">
            Arknights CN Integrated Strategies Localization Project
          </p>
        </div>

        <p className="max-w-3xl text-lg leading-relaxed text-gray-300">
          仙術杯は、中国『Arknights』コミュニティで
          高い人気を誇るIntegrated Strategies（統合戦略）大会です。
          <br />
          <br />
          数々の高難易度攻略や名シーンが生まれ、
          中国ローグライクプレイヤー文化を象徴する存在として知られています。
          <br />
          <br />
          本サイトでは、日本のArknightsコミュニティ向けに、
          仙術杯関連の翻訳・用語解説・大会情報を発信しています。
          <br />
          <br />
        </p>
        <p className="max-w-3xl text-lg leading-relaxed text-gray-300">
        また、統合戦略の攻略やステージ情報に興味のある方は、
        <a
         href="https://tomimi.dev/ja"
         target="_blank"
         rel="noopener noreferrer"
         className="text-pink-300 hover:text-pink-200 underline"
          >
         tomimi.dev
         </a>
         もぜひご活用ください。
         <br />
         日本語表示にも対応しており、
         マップ情報・敵データなどを確認できます。
         <br />
         <br />
         どうぞよろしくお願いします。
        <br />
        </p>

      </section>

      {/* Tournament Archive */}
      <section className="px-10 py-20 border-b border-gray-800">

        <div className="mb-10">
          <h2 className="text-5xl font-bold text-pink-200 mb-2">
            大会アーカイブ
          </h2>

          <p className="text-pink-300">
            仙术杯赛事档案
          </p>

          <p className="text-sm text-gray-500">
            Tournament Archive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {cups.map((cup) => (
    <div
      key={cup.name}
      className="bg-zinc-900 rounded-3xl border border-pink-300/20 overflow-hidden"
    >

      {/* 图片（完整显示） */}
      <img
        src={cup.image}
        className="w-full h-auto object-contain bg-black/10"
      />

      {/* 内容 */}
      <div className="p-6 flex flex-col gap-3">

        <h3 className="text-2xl font-bold text-pink-100">
          {cup.name}
        </h3>

        <p className="text-gray-400 text-sm">
          {cup.desc}
        </p>

        <Link
          href={cup.href}
          className="bg-pink-300 text-black px-5 py-2 rounded-xl w-fit"
        >
          詳細を見る
        </Link>

      </div>

    </div>
  ))}

</div>

      </section>

      {/* Featured Translation */}
      <section className="px-10 py-20 border-b border-gray-800">

        <div className="mb-10">
          <h2 className="text-5xl font-bold text-pink-200 mb-2">
            注目翻訳
          </h2>

          <p className="text-pink-300">
            精选翻译内容
          </p>

          <p className="text-sm text-gray-500">
            Featured Translation
          </p>
        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl border border-pink-300/20">

          <h3 className="text-3xl font-bold mb-4 text-pink-100">
            伊颜轩 - サルカズ近衛怨敵 クイロン戦
          </h3>

          <p className="text-gray-400 mb-6">
            仙術杯を代表する高難易度名シーンの
            日本語ローカライズ。
          </p>

          <div className="bg-black rounded-2xl p-6 border border-gray-700">

            <p className="text-gray-500 mb-2">
              CN Original
            </p>

            <p className="mb-6">
              「这把已经寄了吧……」
            </p>

            <p className="text-gray-500 mb-2">
              JP Localization
            </p>

            <p className="text-pink-200">
              「これ、もう無理だろ……」
            </p>

          </div>

        </div>

      </section>

      {/* Dictionary */}
      <section className="px-10 py-20 border-b border-gray-800">

        <div className="mb-10">
          <h2 className="text-5xl font-bold text-pink-200 mb-2">
            中国コミュニティ用語集
          </h2>

          <p className="text-pink-300">
            中国社区黑话对照表
          </p>

          <p className="text-sm text-gray-500">
            CN Community Dictionary
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-pink-300/20">

          <table className="w-full">

            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left p-4">中国語</th>
                <th className="text-left p-4">日本語</th>
                <th className="text-left p-4">解説</th>
              </tr>
            </thead>

            <tbody className="bg-black">

              <tr className="border-t border-gray-800">
                <td className="p-4">寄了</td>
                <td className="p-4">もう無理</td>
                <td className="p-4 text-gray-400">
                  崩壊寸前の絶望ニュアンス
                </td>
              </tr>

              <tr className="border-t border-gray-800">
                <td className="p-4">火力面</td>
                <td className="p-4">火力枠</td>
                <td className="p-4 text-gray-400">
                  主なダメージ担当
                </td>
              </tr>

              <tr className="border-t border-gray-800">
                <td className="p-4">轮椅</td>
                <td className="p-4">お手軽</td>
                <td className="p-4 text-gray-400">
                  簡単かつ強力な攻略構成
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>

      {/* Join Us */}
      <section className="px-10 py-20">

        <div className="mb-8">
          <h2 className="text-5xl font-bold text-pink-200 mb-2">
            参加募集
          </h2>

          <p className="text-pink-300">
            招募翻译与剪辑协力者
          </p>

          <p className="text-sm text-gray-500">
            Join Us
          </p>
        </div>

        <p className="text-gray-300 max-w-2xl leading-relaxed mb-6">
          翻訳・字幕制作・切り抜き編集など、
          仙術杯JPプロジェクトに興味のある方を募集しています。
          <br />
          <br />
          一緒に中国Arknightsコミュニティ文化を
          日本へ届けてみませんか？
        </p>

        <div className="flex gap-4">

          <button className="bg-pink-300 text-black px-6 py-3 rounded-xl">
            Discord
          </button>

          <button className="bg-zinc-900 border border-pink-300/30 px-6 py-3 rounded-xl">
            Contact
          </button>

        </div>

      </section>

    </main>
  );
}