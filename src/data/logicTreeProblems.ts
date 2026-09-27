export type Axis = {
  id: string
  name: string
  reviewText: string
}

export type Card = {
  id: string
  label: string
  axisId: string | null
}

export type MentorOverrides = {
  nullCard?: string
  mixedAxes?: string
  incomplete?: string
  alreadySolved?: string
}

export type LogicTreeProblem = {
  id: string
  parentLabel: string
  axes: Axis[]
  cards: Card[]
  mentorOverrides?: MentorOverrides
}

export const DEFAULT_MENTOR_MESSAGES = {
  nullCard: '関係ない要素が混ざってるよ',
  mixedAxes: '分け方が混ざってるよ。ダブりが出ちゃう',
  incomplete: 'まだ足りないものがあるよ',
  alreadySolved: 'その分け方はもう見つけたね',
  intro: '親要素を分解してみよう。カードを選んで判定してね！',
} as const

export const logicTreeProblems: LogicTreeProblem[] = [
  {
    id: 'cafe-sales',
    parentLabel: 'カフェの売上',
    axes: [
      {
        id: 'multiply',
        name: '掛け算（客数×客単価）',
        reviewText:
          '売上＝客数×客単価。ケース面接で一番よく使う分け方だよ',
      },
      {
        id: 'customer-type',
        name: '客の種類',
        reviewText:
          '新規とリピートで分けると、どっちに手を打つべきか見えてくるね',
      },
      {
        id: 'weekday',
        name: '曜日',
        reviewText:
          '時間で分けるのも立派な切り口。ピークがどこかを探せるよ',
      },
    ],
    cards: [
      { id: 'c1', label: '客数', axisId: 'multiply' },
      { id: 'c2', label: '客単価', axisId: 'multiply' },
      { id: 'c3', label: '新規客の売上', axisId: 'customer-type' },
      { id: 'c4', label: '既存客の売上', axisId: 'customer-type' },
      { id: 'c5', label: '平日の売上', axisId: 'weekday' },
      { id: 'c6', label: '休日の売上', axisId: 'weekday' },
      { id: 'c7', label: '店長のやる気', axisId: null },
      { id: 'c8', label: '天気', axisId: null },
    ],
  },
  {
    id: 'convenience-profit',
    parentLabel: 'コンビニの利益',
    axes: [
      {
        id: 'subtract',
        name: '引き算（売上−費用）',
        reviewText: '利益＝売上−費用。利益の問題はまずこれで分けよう',
      },
      {
        id: 'product',
        name: '商品区分',
        reviewText:
          '商品で分けるなら『その他』を入れてモレをなくすのがコツ',
      },
    ],
    cards: [
      { id: 'p1', label: '売上', axisId: 'subtract' },
      { id: 'p2', label: '費用', axisId: 'subtract' },
      { id: 'p3', label: '食品の利益', axisId: 'product' },
      { id: 'p4', label: '日用品の利益', axisId: 'product' },
      { id: 'p5', label: 'その他商品の利益', axisId: 'product' },
      { id: 'p6', label: '立地', axisId: null },
      { id: 'p7', label: '店員の数', axisId: null },
    ],
  },
  {
    id: 'employee-count',
    parentLabel: '会社の従業員数',
    axes: [
      {
        id: 'employment',
        name: '雇用形態',
        reviewText:
          '雇用形態で分けると、人件費の話につなげやすいよ',
      },
      {
        id: 'location',
        name: '勤務地',
        reviewText:
          '『東京』と『東京以外』みたいに、AとA以外で分けるとモレが出ないね',
      },
      {
        id: 'department',
        name: '部門',
        reviewText:
          '部門で分けるときも『〜以外』を使えばMECEになるよ',
      },
    ],
    cards: [
      { id: 'e1', label: '正社員', axisId: 'employment' },
      { id: 'e2', label: '非正社員', axisId: 'employment' },
      { id: 'e3', label: '東京勤務', axisId: 'location' },
      { id: 'e4', label: '東京以外で勤務', axisId: 'location' },
      { id: 'e5', label: '営業部門', axisId: 'department' },
      { id: 'e6', label: '営業以外の部門', axisId: 'department' },
      { id: 'e7', label: '残業時間', axisId: null },
      { id: 'e8', label: '平均年齢', axisId: null },
    ],
  },
]
