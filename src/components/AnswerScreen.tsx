import type { LogicTreeProblem } from '../data/logicTreeProblems'
import { Mentor } from './Mentor'
import { TreeView } from './TreeView'
import styles from './QuestionScreen.module.css'
import screenStyles from './Screens.module.css'

type AnswerScreenProps = {
  problem: LogicTreeProblem
  week: number
  /** Player's target axis — shown first among answer trees when present. */
  targetAxisId: string | null
  onBackToSchedule: () => void
}

export function AnswerScreen({
  problem,
  week,
  targetAxisId,
  onBackToSchedule,
}: AnswerScreenProps) {
  const orderedAxes = [...problem.axes].sort((a, b) => {
    if (a.id === targetAxisId) return -1
    if (b.id === targetAxisId) return 1
    return 0
  })

  const nullCards = problem.cards.filter((c) => c.axisId === null)

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <header className={styles.header}>
          <span className={styles.progress}>第{week}週 — 答えと解説</span>
        </header>

        <h2 className={screenStyles.sectionHeading}>答え</h2>
        <div className={screenStyles.answerList}>
          {orderedAxes.map((axis) => {
            const axisCards = problem.cards.filter((c) => c.axisId === axis.id)
            return (
              <div key={axis.id} className={screenStyles.answerBlock}>
                <TreeView
                  parentLabel={problem.parentLabel}
                  childCards={axisCards}
                  caption={axis.name}
                />
                <p className={screenStyles.axisExplanation}>{axis.explanation}</p>
              </div>
            )
          })}
        </div>

        {nullCards.length > 0 && (
          <section className={screenStyles.nullSection} aria-label="関係ない要素">
            <h2 className={screenStyles.sectionHeading}>関係ない要素</h2>
            <ul className={screenStyles.nullList}>
              {nullCards.map((card) => (
                <li key={card.id}>
                  <strong>{card.label}</strong>
                  <span> — {card.nullReason ?? '関係ない要素'}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.nextBtn}
            onClick={onBackToSchedule}
          >
            スケジュールへ戻る
          </button>
        </div>
      </div>

      <Mentor message={problem.summaryExplanation} />
    </div>
  )
}
