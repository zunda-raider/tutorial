import type { Card, LogicTreeProblem } from '../data/logicTreeProblems'
import type { ScoringResult } from '../logic/scoring'
import { Mentor } from './Mentor'
import { TreeView } from './TreeView'
import styles from './QuestionScreen.module.css'
import screenStyles from './Screens.module.css'

type ScoringScreenProps = {
  problem: LogicTreeProblem
  placedCardIds: string[]
  result: ScoringResult
  onShowExplanation: () => void
  onGoHome: () => void
}

export function ScoringScreen({
  problem,
  placedCardIds,
  result,
  onShowExplanation,
  onGoHome,
}: ScoringScreenProps) {
  const placedCards = placedCardIds
    .map((id) => problem.cards.find((c) => c.id === id))
    .filter((c): c is Card => c !== undefined)

  const orderedAxes = [...problem.axes].sort((a, b) => {
    if (a.id === result.targetAxisId) return -1
    if (b.id === result.targetAxisId) return 1
    return 0
  })

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <header className={styles.header}>
          <span className={styles.progress}>採点結果</span>
          {result.targetAxisName && (
            <span className={styles.solvedTag}>
              狙った切り口：{result.targetAxisName}
            </span>
          )}
        </header>

        <div className={screenStyles.scoreHero}>
          <p className={screenStyles.scoreLabel}>スコア</p>
          <p className={screenStyles.scoreValue}>{result.score}</p>
        </div>

        <div
          className={screenStyles.primaryActions}
          role="group"
          aria-label="採点後の操作"
        >
          <button
            type="button"
            className={screenStyles.actionPrimary}
            onClick={onShowExplanation}
          >
            解説を見る
          </button>
          <button
            type="button"
            className={screenStyles.actionSecondary}
            onClick={onGoHome}
          >
            ホームへ戻る
          </button>
        </div>

        <TreeView
          parentLabel={problem.parentLabel}
          childCards={placedCards}
          caption="あなたの答え"
          emptyHint="カードが配置されていません"
        />

        <h2 className={screenStyles.sectionHeading}>正解の切り口</h2>
        <div className={screenStyles.answerList}>
          {orderedAxes.map((axis) => {
            const axisCards = problem.cards.filter((c) => c.axisId === axis.id)
            const isTarget = axis.id === result.targetAxisId
            return (
              <TreeView
                key={axis.id}
                parentLabel={problem.parentLabel}
                childCards={axisCards}
                caption={
                  isTarget ? `${axis.name}（狙った切り口）` : axis.name
                }
              />
            )
          })}
        </div>
      </div>

      <Mentor message={result.mentorMessage} />
    </div>
  )
}
