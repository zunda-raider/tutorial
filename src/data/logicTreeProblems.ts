export type Axis = {
  id: string
  name: string
  explanation: string
}

export type Card = {
  id: string
  label: string
  axisId: string | null
  /** Why this card is irrelevant — only for axisId === null */
  nullReason?: string
}

export type LogicTreeProblem = {
  id: string
  problemStatement: string
  parentLabel: string
  summaryExplanation: string
  axes: Axis[]
  cards: Card[]
}

/**
 * Problem order for the learning flow.
 * The first unsolved problem in this list is started from the learning menu.
 */
export const logicTreeProblems: LogicTreeProblem[] = [
  {
    id: 'cafe-sales',
    problemStatement:
      '駅前のカフェの売上を分解してみよう。モレなく、ダブりなくね',
    parentLabel: 'カフェの売上',
    summaryExplanation:
      '迷ったら、まず掛け算か足し算で分けられないか考えよう。要因（なぜ）と構成要素（何でできているか）を混ぜないのが大事だよ',
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
        nullReason:
          '売上の中身ではなく、売上に影響するかもしれない要因。分解ではなく原因の話',
      },
      {
        id: 'c8',
        label: '天気',
        axisId: null,
        nullReason: 'これも要因。売上を分けた結果には出てこない',
      },
    ],
  },
  {
    id: 'convenience-profit',
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
        explanation: '商品で分けるなら「その他」を入れてモレを防ぐ',
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
        nullReason: '利益に影響する要因で、利益の構成要素ではない',
      },
      {
        id: 'p7',
        label: '店員の数',
        axisId: null,
        nullReason:
          '費用の一部をさらに分けたときに出てくる要素。この段には早すぎる',
      },
    ],
  },
  {
    id: 'employee-count',
    problemStatement: 'ある会社の従業員数を分けてみよう。分け方はいくつもあるよ',
    parentLabel: '会社の従業員数',
    summaryExplanation:
      '「Aと、A以外」はモレをなくす最強の型。困ったらこれを使おう',
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
          '「東京」と「東京以外」のように、AとA以外で分けるとモレが出ない',
      },
      {
        id: 'department',
        name: '部門',
        explanation: '部門が多いときも「〜以外」でまとめればMECEになる',
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
        nullReason: '人数ではなく働き方の指標',
      },
      {
        id: 'e8',
        label: '平均年齢',
        axisId: null,
        nullReason: '従業員の属性の平均で、人数の内訳ではない',
      },
    ],
  },
]

export function getProblemById(id: string): LogicTreeProblem | undefined {
  return logicTreeProblems.find((p) => p.id === id)
}

/** First problem in order that is not yet in the solved set. */
export function firstUnsolvedProblem(
  solvedIds: ReadonlySet<string>,
): LogicTreeProblem | undefined {
  return logicTreeProblems.find((p) => !solvedIds.has(p.id))
}

export function allProblemsSolved(solvedIds: ReadonlySet<string>): boolean {
  return logicTreeProblems.every((p) => solvedIds.has(p.id))
}
