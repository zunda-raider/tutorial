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

  const levelTag = problem.level === 2 ? 'Lv2 — ' : ''

  return (
    <div className={screenStyles.pageWithSticky}>
      <div className={styles.layout}>
        <div className={styles.main}>
          <header className={styles.header}>
            <span className={styles.progress}>
              解説 — {levelTag}
              {problem.parentLabel}
            </span>
          </header>

          {problem.level === 2 && problem.givenTree && (
            <section className={styles.givenTree} aria-label="与えられたツリー">
              <h2 className={styles.givenTitle}>与えられた1段目</h2>
              <div className={styles.parentNode}>
                {problem.givenTree.parentLabel}
              </div>
              {problem.givenTree.children.length > 0 && (
                <>
                  <div className={styles.branchLine} aria-hidden="true" />
                  <div className={styles.children}>
                    {problem.givenTree.children.map((label) => (
                      <span
                        key={label}
                        className={
                          label === problem.digTargetLabel
                            ? styles.digTargetNode
                            : styles.childCardStatic
                        }
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          <h2 className={screenStyles.sectionHeading}>切り口の解説</h2>
          <div className={screenStyles.answerList}>
            {orderedAxes.map((axis) => (
              <div key={axis.id} className={screenStyles.answerBlock}>
                <h3 className={screenStyles.axisName}>{axis.name}</h3>
                <p className={screenStyles.axisExplanation}>{axis.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <Mentor message={problem.summaryExplanation} />
      </div>

      {/* Sibling of layout (not a flex row child) — avoids stretch / transform hit bugs */}
      <div
        className={screenStyles.stickyActionBar}
        role="group"
        aria-label="解説後の操作"
      >
        <button
          type="button"
          className={screenStyles.actionPrimary}
          onClick={onBackToHome}
        >
          ホームへ戻る
        </button>
      </div>
    </div>
  )
}
