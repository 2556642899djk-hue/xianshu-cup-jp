export type TranslationClip = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  image: string;
  dateLabel: string;
  duration: string;
  href?: string;
};

// Replace these publishing slots with the newest translated clips.
// Once href is present, the corresponding card automatically becomes a link.
export const translationClips = [
  {
    id: "featured",
    kicker: "FEATURED / NEXT RELEASE",
    title: "次の翻訳クリップを準備中",
    description:
      "最新の日本語字幕付き動画は、このメイン枠から公開します。更新後はワンクリックで動画へ移動できます。",
    image: "/images/kaienn.png",
    dateLabel: "UPDATE STANDBY",
    duration: "--:--",
  },
  {
    id: "interview",
    kicker: "INTERVIEW / SLOT 01",
    title: "選手インタビュー翻訳",
    description: "新しい動画リンクの登録待ちです。",
    image: "/images/sarkaz.png",
    dateLabel: "COMING SOON",
    duration: "--:--",
  },
  {
    id: "highlight",
    kicker: "HIGHLIGHT / SLOT 02",
    title: "大会ハイライト翻訳",
    description: "新しい動画リンクの登録待ちです。",
    image: "/images/sami.png",
    dateLabel: "COMING SOON",
    duration: "--:--",
  },
  {
    id: "community",
    kicker: "COMMUNITY / SLOT 03",
    title: "コミュニティ名場面",
    description: "新しい動画リンクの登録待ちです。",
    image: "/images/mizuki.png",
    dateLabel: "COMING SOON",
    duration: "--:--",
  },
] as const satisfies readonly TranslationClip[];
