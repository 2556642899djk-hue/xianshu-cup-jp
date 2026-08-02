import rawRecords from "./players.json";
import type { PlayerRecord, SeasonMeta } from "./types";

export const records = rawRecords as PlayerRecord[];

export const seasons: SeasonMeta[] = [
  {
    season: 3,
    shortTheme: "MIZUKI",
    themeJa: "水月と深藍の樹",
    themeCn: "水月与深蓝之树",
    period: "2023.05",
    format: "個人戦",
    accent: "cyan",
  },
  {
    season: 4,
    shortTheme: "SAMI",
    themeJa: "探索者の銀氷止境",
    themeCn: "探索者的银凇止境",
    period: "2023.09",
    format: "2部門・個人戦",
    accent: "ice",
  },
  {
    season: 5,
    shortTheme: "SAMI",
    themeJa: "探索者の銀氷止境",
    themeCn: "探索者的银凇止境",
    period: "2024.03",
    format: "6チーム",
    accent: "ice",
  },
  {
    season: 6,
    shortTheme: "SARKAZ",
    themeJa: "サルカズの炉辺奇談",
    themeCn: "萨卡兹的无终奇语",
    period: "2024.12",
    format: "6チーム",
    accent: "amber",
  },
  {
    season: 7,
    shortTheme: "SARKAZ",
    themeJa: "サルカズの炉辺奇談",
    themeCn: "萨卡兹的无终奇语",
    period: "2025.06",
    format: "6チーム",
    accent: "amber",
  },
  {
    season: 8,
    shortTheme: "SUI",
    themeJa: "歳の界園志異",
    themeCn: "岁的界园志异",
    period: "2026.06",
    format: "招待選手・8枠",
    accent: "rose",
  },
];

export const themes = [
  {
    id: "mizuki",
    label: "IS #03",
    title: "Mizuki",
    titleJa: "水月と深藍の樹",
    titleCn: "水月与深蓝之树",
    cups: "仙術杯 #3",
    image: "/images/mizuki.png",
    href: "/archive?season=3",
    accent: "cyan",
  },
  {
    id: "sami",
    label: "IS #04",
    title: "Sami",
    titleJa: "探索者の銀氷止境",
    titleCn: "探索者的银凇止境",
    cups: "仙術杯 #4—#5",
    image: "/images/sami.png",
    href: "/archive?season=4,5",
    accent: "ice",
  },
  {
    id: "sarkaz",
    label: "IS #05",
    title: "Sarkaz",
    titleJa: "サルカズの炉辺奇談",
    titleCn: "萨卡兹的无终奇语",
    cups: "仙術杯 #6—#7",
    image: "/images/sarkaz.png",
    href: "/archive?season=6,7",
    accent: "amber",
  },
  {
    id: "sui",
    label: "IS #06",
    title: "Sui",
    titleJa: "歳の界園志異",
    titleCn: "岁的界园志异",
    cups: "仙術杯 #8",
    image: "/images/kaienn.png",
    href: "/archive?season=8",
    accent: "rose",
  },
] as const;

export function getSeasonMeta(season: number) {
  return seasons.find((item) => item.season === season);
}

export function getSeasonRecords(season: number) {
  return records.filter((record) => record.season === season);
}
