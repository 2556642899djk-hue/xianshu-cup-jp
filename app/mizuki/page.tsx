export default function MizukiPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-6xl font-bold text-pink-200 mb-4">
        ミズキ仙術杯
      </h1>

      <p className="text-pink-300 mb-10">
        Mizuki Cup Archive
      </p>

      <div className="bg-zinc-900 rounded-3xl p-8 mb-8">

        <h2 className="text-3xl font-bold mb-4">
          公式大会リンク
        </h2>

        <p>
          （这里之后放Bilibili赛事链接）
        </p>

      </div>

      <div className="bg-zinc-900 rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-6">
          翻訳コンテンツ
        </h2>

        <div className="border border-pink-300/20 rounded-2xl p-6">

          <h3 className="text-2xl font-bold text-pink-100 mb-3">
            伊颜轩 - クイロン戦
          </h3>

          <p className="text-gray-400 mb-4">
            サルカズ近衛怨敵ルート攻略
          </p>

          <button className="bg-pink-300 text-black px-5 py-2 rounded-xl">
            View
          </button>

        </div>

      </div>

    </main>
  );
}