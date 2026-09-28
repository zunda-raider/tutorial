import { useMemo, useState } from 'react'
import type { Card, LogicTreeProblem } from '../data/logicTreeProblems'
import { Mentor } from './Mentor'
import styles from './QuestionScreen.module.css'

type QuestionScreenProps = {
  problem: LogicTreeProblem
  questionNumber: number
  totalQuestions: number
  onSubmit: (placedCardIds: string[]) => void
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
  questionNumber,
  totalQuestions,
  onSubmit,
}: QuestionScreenProps) {
  const [orderedCards] = useState<Card[]>(() => shuffleCards(problem.cards))
  const [placedIds, setPlacedIds] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const placedSet = useMemo(() => new Set(placedIds), [placedIds])
  const poolCards = orderedCards.filter((c) => !placedSet.has(c.id))
  const placedCards = placedIds
    .map((id) => problem.cards.find((c) => c.id === id))
    .filter((c): c is Card => c !== undefined)

  const isLv2 = problem.level === 2 && problem.givenTree
  const levelLabel = problem.level === 2 ? 'Lv2' : 'Lv1'

  function placeCard(cardId: string) {
    if (submitted || placedSet.has(cardId)) return
    setPlacedIds((prev) => [...prev, cardId])
  }

  function returnCard(cardId: string) {
    if (submitted) return
    setPlacedIds((prev) => prev.filter((id) => id !== cardId))
  }

  function handleSubmit() {
    if (submitted || placedIds.length === 0) return
    setSubmitted(true)
    onSubmit(placedIds)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <header className={styles.header}>
          <span className={styles.progress}>
            {levelLabel} 問題 {questionNumber} / {totalQuestions}
          </span>
          {isLv2 && problem.digTargetLabel && (
            <span className={styles.solvedTag}>
              「{problem.digTargetLabel}」を分解
            </span>
          )}
        </header>

        {isLv2 && problem.givenTree && (
          <section className={styles.givenTree} aria-label="与えられたツリー">
            <h2 className={styles.givenTitle}>与えられたツリー</h2>
            <div className={styles.parentNode}>
              {problem.givenTree.parentLabel}
            </div>
            {problem.givenTree.children.length > 0 && (
              <>
                <div className={styles.branchLine} aria-hidden="true" />
                <div className={styles.children}>
                  {problem.givenTree.children.map((label) => {
                    const isTarget = label === problem.digTargetLabel
                    return (
                      <span
                        key={label}
                        className={
                          isTarget
                            ? styles.digTargetNode
                            : styles.childCardStatic
                        }
                      >
                        {label}
                        {isTarget ? ' ← ここ' : ''}
                      </span>
                    )
                  })}
                </div>
              </>
            )}
            {problem.givenTree.children.length === 0 && (
              <p className={styles.givenHint}>
                このノードをチャネルなどでさらに分けよう
              </p>
            )}
          </section>
        )}

        <section className={styles.tree} aria-label="ロジックツリー">
          <div className={styles.parentNode}>{problem.parentLabel}</div>
          <div className={styles.branchLine} aria-hidden="true" />
          <div className={styles.children}>
            {placedCards.length === 0 ? (
              <p className={styles.emptyHint}>
                {isLv2
                  ? '下のカードをタップして、この枝の下に配置しよう'
                  : '下のカードをタップして配置しよう'}
              </p>
            ) : (
              placedCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={styles.childCard}
                  onClick={() => returnCard(card.id)}
                  disabled={submitted}
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
                disabled={submitted}
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
            onClick={handleSubmit}
            disabled={submitted || placedIds.length === 0}
          >
            提出
          </button>
        </div>
      </div>

      <Mentor message={problem.problemStatement} />
    </div>
  )
}
