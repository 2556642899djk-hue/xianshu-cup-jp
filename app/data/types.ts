export type MatchVideoStatus = "needs-review" | "verified";

export type PlayerRecord = {
  id: string;
  season: number;
  date: string;
  name: string;
  teamCode: string;
  teamName: string;
  role: string;
  day: number;
  squadCn: string;
  squadJa: string;
  operator: string;
  ending: string;
  score: number;
  scoreLabel: string;
  avatar?: string;
  bilibiliUrl?: string;
  bilibiliSearchUrl: string;
  matchVideoUrl: string;
  matchVideoStatus: MatchVideoStatus;
  sourceUrl: string;
  translationUrl?: string;
};

export type SeasonMeta = {
  season: number;
  shortTheme: string;
  themeJa: string;
  themeCn: string;
  period: string;
  format: string;
  accent: "cyan" | "ice" | "amber" | "rose";
};
