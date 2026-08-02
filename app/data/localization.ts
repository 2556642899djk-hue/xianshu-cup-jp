// Japanese proper nouns are checked against https://tomimi.dev/ja and
// https://arknights.wikiru.jp/index.php?%E7%B5%B1%E5%90%88%E6%88%A6%E7%95%A5.
const operatorNamesJa: Record<string, string> = {
  "凯尔希・思衡托": "ケルシー・エスペランタ",
  "阿米娅（医疗）": "アーミヤ（医療）",
  "寒芒克洛丝": "寒芒クルース",
  "假日威龙陈": "遊龍チェン",
  "缄默德克萨斯": "血掟テキサス",
  "琳琅诗怀雅": "琳琅スワイヤー",
  "百炼嘉维尔": "百錬ガヴィル",
  "承曦格雷伊": "承曦グレイ",
  "焰影苇草": "焔影リード",
  "新约能天使": "新約エクシア",
  "圣聆初雪": "聖聆プラマニクス",
  "麒麟R夜刀": "キリンRヤトウ",
  "艾雅法拉": "エイヤフィヤトラ",
  "安洁莉娜": "アンジェリーナ",
  "卡涅利安": "カーネリアン",
  "维什戴尔": "ウィシャデル",
  "阿斯卡纶": "アスカロン",
  "乌尔比安": "ウルピアヌス",
  "缪尔赛思": "ミュルジス",
  "多萝西": "ドロシー",
  "玛恩纳": "ムリナール",
  "迷迭香": "ロスモンティス",
  "可露希尔": "クロージャ",
  "休谟斯": "ヒューマス",
  "能天使": "エクシア",
  "伊内丝": "イネス",
  "火哨": "ファイヤーホイッスル",
  "鸿雪": "パゼオンカ",
  "温蒂": "ウィーディ",
  "稀音": "シーン",
  "棘刺": "ソーンズ",
  "克洛丝": "クルース",
  "炎熔": "ラヴァ",
  "斑点": "スポット",
  "仇白": "チューバイ",
  "灰烬": "Ash",
  "深靛": "インディゴ",
  "塑心": "ヴィルトゥオーサ",
  "凯尔希": "ケルシー",
  "莱伊": "レイ",
  "逻各斯": "ロゴス",
  "魔王": "シヴィライト・エテルナ",
  "号角": "ホルン",
  "银灰": "シルバーアッシュ",
  "空弦": "アルケット",
  "酒神": "トラゴーディア",
  "艾拉": "Ela",
  "电弧": "レイディアン",
  "望": "ウァン",
  "林": "リン",
  "令": "リィン",
  "锏": "デーゲンブレヒャー",
  "伊桑": "イーサン",
};

const endingNamesJa: Record<string, string> = {
  "何处无山海": "山海なき場所はなく",
  "萨米之熵": "サーミのエントロピー",
  "巍峨银凇": "そびえ立つ銀霜",
  "自然条款": "自然の掟",
  "生人勿近": "生の拒絶",
  "本能污染": "本能の汚染",
  "度假村冤魂": "リゾートの怨霊",
  "深寒造像": "極寒が造りしもの",
  "时光之沙": "時の砂",
  "迈入永恒": "永遠へと踏み入る",
  "利刃所指": "利刃の示す先",
  "虚无之偶": "虚無の偶像",
  "魂灵朝谒": "魂の謁見",
  "思维矫正": "思考矯正",
  "紧急授课": "緊急授業",
  "假想对冲": "仮説の衝突",
  "不容拒绝": "拒絶は許さぬ",
  "排风口": "排気口",
  "昔字如烟": "古き文字は煙の如し",
  "往昔难忆": "往昔は憶い難し",
  "谋岁者": "歳を謀る者",
  "机械之灾": "機械の災い",
  "水火相容": "相容れる水と火",
  "失控": "制御不能",
  "领地意识": "縄張り意識",
  "深度认知": "深度認知",
  "朝谒": "謁見",
  "授法": "説法",
  "巢穴": "巣窟",
  "园丁": "庭師",
  "寒灾": "寒災",
  "墓碑": "墓碑",
  "锈锤": "錆鎚",
  "骑士": "最後の騎士",
  "水月": "ミヅキ",
  "海沫": "ハイモア",
  "洞天福地": "洞天福地",
  "神出鬼没": "神出鬼没",
  "末狩": "末狩",
  "止变": "止変",
  "定乾坤": "定乾坤",
};

function createReplacer(terms: Record<string, string>) {
  const entries = Object.entries(terms).sort(
    ([left], [right]) => right.length - left.length,
  );

  return (value: string) =>
    entries.reduce(
      (localized, [source, target]) => localized.replaceAll(source, target),
      value,
    );
}

const replaceOperatorNames = createReplacer(operatorNamesJa);
const replaceEndingNames = createReplacer(endingNamesJa);

export function getOperatorNameJa(value: string) {
  return replaceOperatorNames(value).replaceAll("（重开）", "（リスタート）");
}

export function getEndingNameJa(value: string) {
  return replaceEndingNames(value)
    .replaceAll("緊急・", "緊急作戦・")
    .replaceAll("3级蛋", "Lv.3の卵")
    .replaceAll("1级蛋", "Lv.1の卵");
}
