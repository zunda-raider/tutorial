import type { Card, LogicTreeProblem } from '../data/logicTreeProblems'
import type { ScoringResult } from '../logic/scoring'
import { Mentor } from './Mentor'
import { TreeView } from './TreeView'
import styles from './QuestionScreen.module.css'
import screenStyles from './Screens.module.css'

type ScoringScreenProps = {
  problem: LogicTreeProblem
  week: number
  placedCardIds: string[]
  result: ScoringResult
  onShowAnswer: () => void
}

export function ScoringScreen({
  problem,
  week,
  placedCardIds,
  result,
  onShowAnswer,
}: ScoringScreenProps) {
  const placedCards = placedCardIds
    .map((id) => problem.cards.find((c) => c.id === id))
    .filter((c): c is Card => c !== undefined)

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <header className={styles.header}>
          <span className={styles.progress}>第{week}週 — 採点結果</span>
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

        <ul className={screenStyles.checklist} aria-label="チェックリスト">
          {result.checklist.map((item) => (
            <li
              key={item.id}
              className={
                item.passed
                  ? screenStyles.checkPass
                  : screenStyles.checkFail
              }
            >
              <span className={screenStyles.checkMark} aria-hidden="true">
                {item.passed ? '○' : '×'}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        <TreeView
          parentLabel={problem.parentLabel}
          childCards={placedCards}
          caption="あなたの答え"
          emptyHint="カードが配置されていません"
        />

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.nextBtn}
            onClick={onShowAnswer}
          >
            答えを見る
          </button>
        </div>
      </div>

      <Mentor message={result.mentorMessage} />
    </div>
  )
}
