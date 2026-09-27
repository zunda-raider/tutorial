/**
 * Shared scoring config for the logic-tree prototype.
 * Tune COVERAGE_WEIGHT, SCORE_PENALTY_PER_OFF_AXIS, SCORE_BANDS,
 * and AUTO_EXPLANATION_THRESHOLD here.
 */
import type { Card, LogicTreeProblem } from '../data/logicTreeProblems'

/** Weight of coverage ratio (placed-of-axis / total-of-axis) before scaling to 100. */
export const COVERAGE_WEIGHT = 100

/** Points deducted per placed card that is not of the target axis (includes null). */
export const SCORE_PENALTY_PER_OFF_AXIS = 20

/**
 * From the scoring screen, if score ≤ this threshold, pressing「ホームへ戻る」
 * routes to the Explanation screen instead of Home.
 */
export const AUTO_EXPLANATION_THRESHOLD = 40

/**
 * Mentor dialogue bands by score (inclusive ranges).
 * Checked from high to low; first match wins.
 */
export const SCORE_BANDS = [
  {
    min: 100,
    max: 100,
    mentorMessage: '完璧！狙った切り口をモレなくダブりなく置けたね。',
  },
  {
    min: 60,
    max: 99,
    mentorMessage:
      'いい線いってるよ。チェックリストを確認して、次はもっときれいに分けてみよう。',
  },
  {
    min: 0,
    max: 59,
    mentorMessage:
      '今回は少し苦戦したみたい。答えと解説を見て、切り口の考え方を復習しよう。',
  },
] as const

export type ChecklistItem = {
  id: 'no_null' | 'no_mixed' | 'no_missing'
  label: string
  passed: boolean
}

export type ScoringResult = {
  /** Most frequent non-null axis among placed cards; null if none. */
  targetAxisId: string | null
  targetAxisName: string | null
  score: number
  checklist: ChecklistItem[]
  mentorMessage: string
}

/**
 * Among placed cards with a non-null axisId, pick the most frequent axis.
 * On a tie, pick the first axis in problem.axes order among the tied ones.
 * If no placed card has a non-null axis (empty or all-null) → null
 * (score 0, no target).
 */
export function resolveTargetAxis(
  problem: LogicTreeProblem,
  placed: Card[],
): string | null {
  const counts = new Map<string, number>()
  for (const card of placed) {
    if (card.axisId === null) continue
    counts.set(card.axisId, (counts.get(card.axisId) ?? 0) + 1)
  }
  if (counts.size === 0) return null

  let bestCount = 0
  for (const count of counts.values()) {
    if (count > bestCount) bestCount = count
  }

  const tiedIds = [...counts.entries()]
    .filter(([, count]) => count === bestCount)
    .map(([axisId]) => axisId)

  for (const axis of problem.axes) {
    if (tiedIds.includes(axis.id)) return axis.id
  }
  return tiedIds[0] ?? null
}

/**
 * Score formula:
 *   score = COVERAGE_WEIGHT * (placedOfTarget / totalOfTarget)
 *         - SCORE_PENALTY_PER_OFF_AXIS * (placed not of target)
 * Clamp ≥ 0, round to integer.
 *
 * Empty placement or all-null cards → no target → score 0.
 */
export function computeScore(
  problem: LogicTreeProblem,
  placed: Card[],
  targetAxisId: string | null,
): number {
  if (targetAxisId === null) return 0

  const totalOfTarget = problem.cards.filter(
    (c) => c.axisId === targetAxisId,
  ).length
  if (totalOfTarget === 0) return 0

  const placedOfTarget = placed.filter((c) => c.axisId === targetAxisId).length
  const placedOffTarget = placed.filter((c) => c.axisId !== targetAxisId).length

  const raw =
    COVERAGE_WEIGHT * (placedOfTarget / totalOfTarget) -
    SCORE_PENALTY_PER_OFF_AXIS * placedOffTarget

  return Math.max(0, Math.round(raw))
}

export function buildChecklist(
  problem: LogicTreeProblem,
  placed: Card[],
  targetAxisId: string | null,
): ChecklistItem[] {
  if (placed.length === 0) {
    return [
      { id: 'no_null', label: '関係ない要素が入っていないか', passed: false },
      { id: 'no_mixed', label: '分け方が混ざっていないか', passed: false },
      { id: 'no_missing', label: 'モレがないか', passed: false },
    ]
  }

  const noNull = placed.every((c) => c.axisId !== null)

  const noCardsOutsideTarget =
    targetAxisId !== null && placed.every((c) => c.axisId === targetAxisId)

  const allOfTargetPlaced =
    targetAxisId !== null &&
    problem.cards
      .filter((c) => c.axisId === targetAxisId)
      .every((c) => placed.some((p) => p.id === c.id))

  return [
    {
      id: 'no_null',
      label: '関係ない要素が入っていないか',
      passed: noNull,
    },
    {
      id: 'no_mixed',
      label: '分け方が混ざっていないか',
      passed: noCardsOutsideTarget,
    },
    {
      id: 'no_missing',
      label: 'モレがないか',
      passed: allOfTargetPlaced,
    },
  ]
}

export function mentorMessageForScore(score: number): string {
  for (const band of SCORE_BANDS) {
    if (score >= band.min && score <= band.max) return band.mentorMessage
  }
  return SCORE_BANDS[SCORE_BANDS.length - 1].mentorMessage
}

export function scoreSubmission(
  problem: LogicTreeProblem,
  placedCardIds: string[],
): ScoringResult {
  const cardById = new Map(problem.cards.map((c) => [c.id, c]))
  const placed = placedCardIds
    .map((id) => cardById.get(id))
    .filter((c): c is Card => c !== undefined)

  const targetAxisId = resolveTargetAxis(problem, placed)
  const targetAxis = targetAxisId
    ? (problem.axes.find((a) => a.id === targetAxisId) ?? null)
    : null
  const score = computeScore(problem, placed, targetAxisId)
  const checklist = buildChecklist(problem, placed, targetAxisId)

  return {
    targetAxisId,
    targetAxisName: targetAxis?.name ?? null,
    score,
    checklist,
    mentorMessage: mentorMessageForScore(score),
  }
}
