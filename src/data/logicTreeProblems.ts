export type Axis = {
  id: string
  name: string
  explanation: string
}

export type Card = {
  id: string
  label: string
  axisId: string | null
}

/** First-level tree shown to the player (Lv2); not guessed. */
export type GivenTree = {
  parentLabel: string
  children: string[]
}

export type ProblemLevel = 1 | 2

export type LogicTreeProblem = {
  id: string
  /** 1 = find a 1-level decomposition; 2 = dig one branch of a given tree */
  level: ProblemLevel
  problemStatement: string
  /**
   * Node under which the player places cards.
   * Lv1: the root to decompose. Lv2: digTargetLabel (branch being expanded).
   */
  parentLabel: string
  summaryExplanation: string
  axes: Axis[]
  cards: Card[]
  /** Lv2 only: presented first-level tree (parent + children). */
  givenTree?: GivenTree
  /** Lv2 only: which givenTree node (or root) the player expands. */
  digTargetLabel?: string
}

/**
 * Problem order for the learning flow.
 * Within each level, the first unsolved problem is started from the menu.
 */
export const logicTreeProblems: LogicTreeProblem[] = [
  // ——— Level 1 ———
  {
    id: 'cafe-sales',
    level: 1,
    problemStatement:
      '駅前のカフェの売上を分解してみよう',
    parentLabel: 'カフェの売上',
    summaryExplanation:
      '迷ったら、まず掛け算か足し算で分けられないか考えよう。要因（なぜ）と構成要素（何でできているか）を区別するのが大事だよ',
    axes: [
      {
        id: 'multiply',
        name: '掛け算',
        explanation:
          '売上＝客数×客単価。ケース面接で最もよく使う分け方。どちらが落ちているかで打ち手が変わる',
      },
      {
        id: 'customer-type',
        name: '客の種類',
        explanation:
          '新規とリピートで分けると、集客と定着のどちらに問題があるかが見える',
      },
      {
        id: 'weekday',
        name: '曜日',
        explanation:
          '時間で分けるのも切り口の一つ。平日と休日で客層が違う店では特に有効',
      },
    ],
    cards: [
      { id: 'c1', label: '客数', axisId: 'multiply' },
      { id: 'c2', label: '客単価', axisId: 'multiply' },
      { id: 'c3', label: '新規客の売上', axisId: 'customer-type' },
      { id: 'c4', label: '既存客の売上', axisId: 'customer-type' },
      { id: 'c5', label: '平日の売上', axisId: 'weekday' },
      { id: 'c6', label: '休日の売上', axisId: 'weekday' },
      {
        id: 'c7',
        label: '店長のやる気',
        axisId: null,
      },
      {
        id: 'c8',
        label: '天気',
        axisId: null,
      },
    ],
  },
  {
    id: 'convenience-profit',
    level: 1,
    problemStatement: '今度はコンビニの利益。売上とは分け方が変わるよ',
    parentLabel: 'コンビニの利益',
    summaryExplanation:
      '階層を意識しよう。「店員の数」は費用の下に来るもので、利益のすぐ下には置けないんだ',
    axes: [
      {
        id: 'subtract',
        name: '引き算',
        explanation: '利益＝売上−費用。利益の問題はまずこれで分ける',
      },
      {
        id: 'product',
        name: '商品区分',
        explanation: '商品で分けるなら「その他」も含めて考えよう',
      },
    ],
    cards: [
      { id: 'p1', label: '売上', axisId: 'subtract' },
      { id: 'p2', label: '費用', axisId: 'subtract' },
      { id: 'p3', label: '食品の利益', axisId: 'product' },
      { id: 'p4', label: '日用品の利益', axisId: 'product' },
      { id: 'p5', label: 'その他商品の利益', axisId: 'product' },
      {
        id: 'p6',
        label: '立地',
        axisId: null,
      },
      {
        id: 'p7',
        label: '店員の数',
        axisId: null,
      },
    ],
  },
  {
    id: 'employee-count',
    level: 1,
    problemStatement: 'ある会社の従業員数を分けてみよう。分け方はいくつもあるよ',
    parentLabel: '会社の従業員数',
    summaryExplanation:
      '「Aと、A以外」のように、全体を捉えやすい形で分けてみよう',
    axes: [
      {
        id: 'employment',
        name: '雇用形態',
        explanation: '人件費や採用の話につなげやすい',
      },
      {
        id: 'location',
        name: '勤務地',
        explanation:
          '「東京」と「東京以外」のように、全体を捉えやすく分けられる',
      },
      {
        id: 'department',
        name: '部門',
        explanation: '部門が多いときは「〜以外」でまとめると整理しやすい',
      },
    ],
    cards: [
      { id: 'e1', label: '正社員', axisId: 'employment' },
      { id: 'e2', label: '非正社員', axisId: 'employment' },
      { id: 'e3', label: '東京勤務', axisId: 'location' },
      { id: 'e4', label: '東京以外で勤務', axisId: 'location' },
      { id: 'e5', label: '営業部門', axisId: 'department' },
      { id: 'e6', label: '営業以外の部門', axisId: 'department' },
      {
        id: 'e7',
        label: '残業時間',
        axisId: null,
      },
      {
        id: 'e8',
        label: '平均年齢',
        axisId: null,
      },
    ],
  },

  // ——— Level 2 ———
  {
    id: 'cafe-sales-lv2-customers',
    level: 2,
    problemStatement:
      '1段目はもう分けてあるよ。強調した「客数」を、もう一段深く分解してみよう',
    parentLabel: '客数',
    digTargetLabel: '客数',
    givenTree: {
      parentLabel: 'カフェの売上',
      children: ['客数', '客単価'],
    },
    summaryExplanation:
      '客数＝新規＋既存は足し算の定番。すでに1段目にある「客単価」を客数の下に入れないこと。階層を混ぜないのがポイントだよ',
    axes: [
      {
        id: 'new-existing',
        name: '新規・既存',
        explanation:
          '客数＝新規客＋既存客。集客とリピートのどちらが弱いかが見える',
      },
      {
        id: 'weekday-customers',
        name: '曜日',
        explanation: '平日客と休日客で分けると、曜日ごとの稼働の差が見える',
      },
    ],
    cards: [
      { id: 'l2a1', label: '新規客', axisId: 'new-existing' },
      { id: 'l2a2', label: '既存客', axisId: 'new-existing' },
      { id: 'l2a3', label: '平日の客数', axisId: 'weekday-customers' },
      { id: 'l2a4', label: '休日の客数', axisId: 'weekday-customers' },
      {
        id: 'l2a5',
        label: '客単価',
        axisId: null,
      },
      {
        id: 'l2a6',
        label: '天気',
        axisId: null,
      },
    ],
  },
  {
    id: 'cafe-sales-lv2-channel',
    level: 2,
    problemStatement:
      '今度は売上そのものを販売チャネルで分けてみよう。カードの意味にも目を向けてね',
    parentLabel: 'カフェの売上',
    digTargetLabel: 'カフェの売上',
    givenTree: {
      parentLabel: 'カフェの売上',
      children: [],
    },
    summaryExplanation:
      'チャネルで分けるなら「売上が立つ場所」で揃える。広告やセミナーは売上の構成ではなく、集客・別事業の話になりやすいよ',
    axes: [
      {
        id: 'channel',
        name: '販売チャネル',
        explanation:
          '売上＝オンライン販売＋店頭販売。どこで売れているかが一度に見える',
      },
      {
        id: 'dine-takeout',
        name: '提供形態',
        explanation: '店内とテイクアウトで分けると、席数制約の影響が見える',
      },
    ],
    cards: [
      { id: 'l2b1', label: 'オンライン販売', axisId: 'channel' },
      { id: 'l2b2', label: '店頭販売', axisId: 'channel' },
      { id: 'l2b3', label: '店内飲食', axisId: 'dine-takeout' },
      { id: 'l2b4', label: 'テイクアウト', axisId: 'dine-takeout' },
      {
        id: 'l2b5',
        label: '広告',
        axisId: null,
      },
      {
        id: 'l2b6',
        label: 'セミナー',
        axisId: null,
      },
    ],
  },
  {
    id: 'convenience-lv2-cost',
    level: 2,
    problemStatement:
      '利益の1段目は売上と費用。強調した「費用」を、さらに分解してみよう',
    parentLabel: '費用',
    digTargetLabel: '費用',
    givenTree: {
      parentLabel: 'コンビニの利益',
      children: ['売上', '費用'],
    },
    summaryExplanation:
      '費用は人件費・家賃・仕入などに分けられる。利益や売上を費用の下に置くと階層が崩れるから注意してね',
    axes: [
      {
        id: 'cost-type',
        name: '費用の種類',
        explanation:
          '人件費・家賃・仕入原価など、性質の違う費用に分ける定番の切り口',
      },
      {
        id: 'fixed-variable',
        name: '固定・変動',
        explanation: '固定費と変動費で分けると、売上変動時の利益感度が見える',
      },
    ],
    cards: [
      { id: 'l2c1', label: '人件費', axisId: 'cost-type' },
      { id: 'l2c2', label: '家賃', axisId: 'cost-type' },
      { id: 'l2c3', label: '仕入原価', axisId: 'cost-type' },
      { id: 'l2c4', label: '固定費', axisId: 'fixed-variable' },
      { id: 'l2c5', label: '変動費', axisId: 'fixed-variable' },
      {
        id: 'l2c6',
        label: '売上',
        axisId: null,
      },
      {
        id: 'l2c7',
        label: '立地',
        axisId: null,
      },
    ],
  },
]

export function getProblemById(id: string): LogicTreeProblem | undefined {
  return logicTreeProblems.find((p) => p.id === id)
}

export function problemsForLevel(level: ProblemLevel): LogicTreeProblem[] {
  return logicTreeProblems.filter((p) => p.level === level)
}

/** First problem in the given level that is not yet in the solved set. */
export function firstUnsolvedProblem(
  solvedIds: ReadonlySet<string>,
  level: ProblemLevel = 1,
): LogicTreeProblem | undefined {
  return problemsForLevel(level).find((p) => !solvedIds.has(p.id))
}

export function allProblemsSolved(
  solvedIds: ReadonlySet<string>,
  level?: ProblemLevel,
): boolean {
  const list = level === undefined ? logicTreeProblems : problemsForLevel(level)
  return list.every((p) => solvedIds.has(p.id))
}

/** Display name for home / calendar (Lv2 includes dig context). */
export function problemDisplayName(problem: LogicTreeProblem): string {
  if (problem.level === 2 && problem.givenTree) {
    return `${problem.givenTree.parentLabel} › ${problem.parentLabel}`
  }
  return problem.parentLabel
}
