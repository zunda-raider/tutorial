import type { LogicTreeProblem } from '../data/logicTreeProblems'
import { Mentor } from './Mentor'
import styles from './QuestionScreen.module.css'
import screenStyles from './Screens.module.css'

type ExplanationScreenProps = {
  problem: LogicTreeProblem
  /** Player's target axis — shown first when present. */
  targetAxisId: string | null
  onBackToHome: () => void
}

export function ExplanationScreen({
  problem,
  targetAxisId,
  onBackToHome,
}: ExplanationScreenProps) {
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
          <span className={styles.progress}>解説 — {problem.parentLabel}</span>
        </header>

        <h2 className={screenStyles.sectionHeading}>切り口の解説</h2>
        <div className={screenStyles.answerList}>
          {orderedAxes.map((axis) => (
            <div key={axis.id} className={screenStyles.answerBlock}>
              <h3 className={screenStyles.axisName}>{axis.name}</h3>
              <p className={screenStyles.axisExplanation}>{axis.explanation}</p>
            </div>
          ))}
        </div>

        {nullCards.length > 0 && (
          <section
            className={screenStyles.nullSection}
            aria-label="関係ない要素"
          >
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
            onClick={onBackToHome}
          >
            ホームへ戻る
          </button>
        </div>
      </div>

      <Mentor message={problem.summaryExplanation} />
    </div>
  )
}
