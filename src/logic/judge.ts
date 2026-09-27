import type { Card, LogicTreeProblem, MentorOverrides } from '../data/logicTreeProblems'
import { DEFAULT_MENTOR_MESSAGES } from '../data/logicTreeProblems'

export type JudgeWrongReason = 'null_card' | 'mixed_axes' | 'incomplete'

export type JudgeResult =
  | {
      status: 'wrong'
      reason: JudgeWrongReason
      highlightCardIds: string[]
      mentorMessage: string
    }
  | {
      status: 'correct'
      axisId: string
      mentorMessage: string
    }

function msg(
  overrides: MentorOverrides | undefined,
  key: keyof typeof DEFAULT_MENTOR_MESSAGES,
): string {
  if (overrides) {
    const overrideKey = key as keyof MentorOverrides
    const value = overrides[overrideKey]
    if (value) return value
  }
  return DEFAULT_MENTOR_MESSAGES[key]
}

/**
 * Pure judgment for placed child cards under a parent node.
 * Order of checks: null cards → mixed axes → incomplete axis → correct.
 */
export function judgePlacedCards(
  problem: LogicTreeProblem,
  placedCardIds: string[],
): JudgeResult {
  const cardById = new Map(problem.cards.map((c) => [c.id, c]))
  const placed: Card[] = placedCardIds
    .map((id) => cardById.get(id))
    .filter((c): c is Card => c !== undefined)

  if (placed.length === 0) {
    return {
      status: 'wrong',
      reason: 'incomplete',
      highlightCardIds: [],
      mentorMessage: msg(problem.mentorOverrides, 'incomplete'),
    }
  }

  // 1. Any null (irrelevant) card
  const nullCards = placed.filter((c) => c.axisId === null)
  if (nullCards.length > 0) {
    return {
      status: 'wrong',
      reason: 'null_card',
      highlightCardIds: nullCards.map((c) => c.id),
      mentorMessage: msg(problem.mentorOverrides, 'nullCard'),
    }
  }

  // All remaining placed cards have a non-null axisId
  const axisCounts = new Map<string, number>()
  for (const card of placed) {
    const axisId = card.axisId as string
    axisCounts.set(axisId, (axisCounts.get(axisId) ?? 0) + 1)
  }

  // 2. Two or more different axes mixed
  if (axisCounts.size >= 2) {
    let mostFrequentAxis = ''
    let mostFrequentCount = -1
    for (const [axisId, count] of axisCounts) {
      if (count > mostFrequentCount) {
        mostFrequentCount = count
        mostFrequentAxis = axisId
      }
    }
    const highlightCardIds = placed
      .filter((c) => c.axisId !== mostFrequentAxis)
      .map((c) => c.id)

    return {
      status: 'wrong',
      reason: 'mixed_axes',
      highlightCardIds,
      mentorMessage: msg(problem.mentorOverrides, 'mixedAxes'),
    }
  }

  // Exactly one axis among placed cards
  const axisId = [...axisCounts.keys()][0]
  const allOfAxis = problem.cards.filter((c) => c.axisId === axisId)
  const placedOfAxis = placed.filter((c) => c.axisId === axisId)

  // 3. Not all cards of that axis placed
  if (placedOfAxis.length < allOfAxis.length) {
    return {
      status: 'wrong',
      reason: 'incomplete',
      highlightCardIds: [],
      mentorMessage: msg(problem.mentorOverrides, 'incomplete'),
    }
  }

  // 4. Correct — full single axis
  const axis = problem.axes.find((a) => a.id === axisId)
  return {
    status: 'correct',
    axisId,
    mentorMessage: axis?.reviewText ?? 'よくできたね！',
  }
}

export function getAlreadySolvedMessage(
  problem: LogicTreeProblem,
): string {
  return msg(problem.mentorOverrides, 'alreadySolved')
}
