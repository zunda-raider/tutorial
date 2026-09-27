import { useMemo, useState } from 'react'
import type { Card, LogicTreeProblem } from '../data/logicTreeProblems'
import { DEFAULT_MENTOR_MESSAGES } from '../data/logicTreeProblems'
import {
  getAlreadySolvedMessage,
  judgePlacedCards,
  type JudgeResult,
} from '../logic/judge'
import { Mentor } from './Mentor'
import styles from './QuestionScreen.module.css'

type QuestionScreenProps = {
  problem: LogicTreeProblem
  questionIndex: number
  totalQuestions: number
  onNext: () => void
}

function shuffleCards(cards: Card[]): Card[] {
  const arr = [...cards]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function QuestionScreen({
  problem,
  questionIndex,
  totalQuestions,
  onNext,
}: QuestionScreenProps) {
  const [orderedCards, setOrderedCards] = useState<Card[]>(() =>
    shuffleCards(problem.cards),
  )
  const [placedIds, setPlacedIds] = useState<string[]>([])
  const [solvedAxes, setSolvedAxes] = useState<Set<string>>(() => new Set())
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null)
  const [alreadySolved, setAlreadySolved] = useState(false)
  const [mentorMessage, setMentorMessage] = useState<string>(
    DEFAULT_MENTOR_MESSAGES.intro,
  )
  const [highlightIds, setHighlightIds] = useState<string[]>([])
  const [showSuccessActions, setShowSuccessActions] = useState(false)

  const placedSet = useMemo(() => new Set(placedIds), [placedIds])
  const poolCards = orderedCards.filter((c) => !placedSet.has(c.id))
  const placedCards = placedIds
    .map((id) => problem.cards.find((c) => c.id === id))
    .filter((c): c is Card => c !== undefined)

  const hasUnsolvedAxes = solvedAxes.size < problem.axes.length

  function placeCard(cardId: string) {
    if (placedSet.has(cardId)) return
    setPlacedIds((prev) => [...prev, cardId])
    resetFeedback()
  }

  function returnCard(cardId: string) {
    setPlacedIds((prev) => prev.filter((id) => id !== cardId))
    resetFeedback()
  }

  function resetFeedback() {
    setJudgeResult(null)
    setAlreadySolved(false)
    setHighlightIds([])
    setShowSuccessActions(false)
    setMentorMessage(DEFAULT_MENTOR_MESSAGES.intro)
  }

  function handleJudge() {
    const result = judgePlacedCards(problem, placedIds)
    setJudgeResult(result)
    setAlreadySolved(false)

    if (result.status === 'wrong') {
      setHighlightIds(result.highlightCardIds)
      setMentorMessage(result.mentorMessage)
      setShowSuccessActions(false)
      return
    }

    setHighlightIds([])

    if (solvedAxes.has(result.axisId)) {
      setAlreadySolved(true)
      setMentorMessage(getAlreadySolvedMessage(problem))
      setShowSuccessActions(true)
      return
    }

    setSolvedAxes((prev) => new Set(prev).add(result.axisId))
    setMentorMessage(result.mentorMessage)
    setShowSuccessActions(true)
  }

  function handleRetryOtherAxis() {
    setPlacedIds([])
    setJudgeResult(null)
    setAlreadySolved(false)
    setHighlightIds([])
    setShowSuccessActions(false)
    setMentorMessage(DEFAULT_MENTOR_MESSAGES.intro)
    setOrderedCards(shuffleCards(problem.cards))
  }

  const isCorrectNew = judgeResult?.status === 'correct' && !alreadySolved
  const highlightSet = new Set(highlightIds)

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <header className={styles.header}>
          <span className={styles.progress}>
            問題 {questionIndex + 1} / {totalQuestions}
          </span>
          {solvedAxes.size > 0 && (
            <span className={styles.solvedTag}>
              発見した切り口 {solvedAxes.size}/{problem.axes.length}
            </span>
          )}
        </header>

        <section className={styles.tree} aria-label="ロジックツリー">
          <div className={styles.parentNode}>{problem.parentLabel}</div>
          <div className={styles.branchLine} aria-hidden="true" />
          <div className={styles.children}>
            {placedCards.length === 0 ? (
              <p className={styles.emptyHint}>
                下のカードをタップして配置しよう
              </p>
            ) : (
              placedCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={[
                    styles.childCard,
                    highlightSet.has(card.id) ? styles.highlighted : '',
                    isCorrectNew ? styles.correctCard : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => returnCard(card.id)}
                  aria-label={`${card.label}をプールに戻す`}
                >
                  {card.label}
                </button>
              ))
            )}
          </div>
        </section>

        <section className={styles.pool} aria-label="カードプール">
          <h2 className={styles.poolTitle}>カード</h2>
          <div className={styles.poolGrid}>
            {poolCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className={styles.poolCard}
                onClick={() => placeCard(card.id)}
              >
                {card.label}
              </button>
            ))}
            {poolCards.length === 0 && (
              <p className={styles.emptyHint}>すべてのカードを配置中</p>
            )}
          </div>
        </section>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.judgeBtn}
            onClick={handleJudge}
            disabled={placedIds.length === 0}
          >
            判定
          </button>
          {showSuccessActions && (
            <>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={onNext}
              >
                次へ
              </button>
              {hasUnsolvedAxes && (
                <button
                  type="button"
                  className={styles.altBtn}
                  onClick={handleRetryOtherAxis}
                >
                  別の切り口でも解く
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <Mentor message={mentorMessage} />
    </div>
  )
}
