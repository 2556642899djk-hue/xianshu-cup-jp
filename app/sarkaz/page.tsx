//第六届预赛集合
const cup6Preliminary = [
  {
     order: 1,

    name: "魔法ZC目録",
    squad: "突撃戦術分隊（理想）",
    operator: "ムリナール",
    ending: "第5結末",
    score: 182,

    bilibili: " https://www.bilibili.com/video/BV1SukfYFEmb",
    
  },
];

//第六届决赛集合
const cup6Final = [];

//第七届预赛集合
const cup7Preliminary = [];

//第七届决赛集合
const cup7Final = [];

import Link from "next/link";

type Player = {
  name: string;
  squad: string;
  operator: string;
  ending: string;
  score: number;
  bilibili: string;
  article?: string;
};

export default function SarkazPage() {
  return (
    <main className="min-h-screen bg-black text-white px-10 py-20">
{/* 光效 */}
  <div className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] bg-pink-500/20 blur-[120px] rounded-full" />
  <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />

      <h1 className="text-6xl font-bold text-pink-200 mb-4">
        サルカズ仙術杯アーカイブ
      </h1>

      <p className="text-gray-400 mb-16">
        サルカズ統合戦略（仙術杯 #6・#7）の大会記録一覧
      </p>

      {/* Cup 6 */}
      <section className="mb-20">

        <h2 className="text-4xl font-bold text-pink-200 mb-10">
          仙術杯 #6
        </h2>

        {/* 予選 */}
        <h3 className="text-2xl font-bold mb-6">
          予選
        </h3>
        <div className="grid gap-6">
        {[...cup6Preliminary]
        .sort((a, b) => a.order - b.order)
        .map((player) => (
        <PlayerCard
        key={player.name}
        player={player}
        />
        ))}

        </div>

        {/* 決勝 */}
        <h3 className="text-2xl font-bold mt-16 mb-6">
          決勝
        </h3>

        <div className="grid gap-6">
          {[...cup6Final]
          .sort((a, b) => a.order - b.order)
          .map((player) => (
          <PlayerCard
          key={player.name}
          player={player}
          />
          ))}
        </div>

      </section>

      {/* Cup 7 */}
      <section>

        <h2 className="text-4xl font-bold text-pink-200 mb-10">
          仙術杯 #7
        </h2>

        <h3 className="text-2xl font-bold mb-6">
          予選
        </h3>

        <div className="grid gap-6">
          {[...cup7Preliminary]
          .sort((a, b) => a.order - b.order)
          .map((player) => (
          <PlayerCard
          key={player.name}
          player={player}
          />
          ))}
        </div>

        <h3 className="text-2xl font-bold mt-16 mb-6">
          決勝
        </h3>

        <div className="grid gap-6">
          {[...cup7Final]
          .sort((a, b) => a.order - b.order)
          .map((player) => (
          <PlayerCard
          key={player.name}
          player={player}
          />
          ))}
        </div>

      </section>

    </main>
  );
}

function PlayerCard({
  player,
}: {
  player: {
    name: string;
    squad: string;
    operator: string;
    ending: string;
    score: number;
    bilibili: string;
    article?: string;
  };
}) {
  return (
    <div className="bg-zinc-900 rounded-3xl border border-pink-300/20 p-6">

      <h3 className="text-2xl font-bold text-pink-100 mb-6">
        {player.name}
      </h3>

      <div className="grid grid-cols-[140px_1fr] gap-y-3">

        <div className="text-gray-500">
          戦術分隊
        </div>

        <div>
          {player.squad}
        </div>

        <div className="text-gray-500">
          初手オペレーター
        </div>

        <div>
          {player.operator}
        </div>

        <div className="text-gray-500">
          達成結末
        </div>

        <div>
          {player.ending}
        </div>

        <div className="text-gray-500">
          得点
        </div>

        <div className="text-pink-300 font-bold">
          {player.score}
        </div>

      </div>

      <div className="flex gap-3 mt-8">

        <a
          href={player.bilibili}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pink-300 text-black px-4 py-2 rounded-xl"
        >
          Bilibiliを見る
        </a>

        {player.article && (
          <Link
            href={player.article}
            className="border border-pink-300/30 px-4 py-2 rounded-xl"
          >
            翻訳記事
          </Link>
        )}

      </div>

    </div>
  );
}