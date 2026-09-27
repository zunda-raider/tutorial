import { TOTAL_WEEKS, type WeekNumber } from '../data/logicTreeProblems'
import styles from './Screens.module.css'

type ScheduleScreenProps = {
  currentWeek: WeekNumber
  weekScores: (number | null)[]
  onSelectWeek: (week: WeekNumber) => void
  onBack: () => void
}

export function ScheduleScreen({
  currentWeek,
  weekScores,
  onSelectWeek,
  onBack,
}: ScheduleScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.panel}>
        <h1 className={styles.panelTitle}>スケジュール</h1>
        <p className={styles.hint}>
          第{currentWeek}週が進行中です。今週を選んで学習を始めよう
        </p>
        <ul className={styles.menuList}>
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
            const week = (i + 1) as WeekNumber
            const score = weekScores[i]
            const finished = score !== null
            const isCurrent = week === currentWeek && !finished

            let status: 'current' | 'finished' | 'locked'
            if (finished) status = 'finished'
            else if (isCurrent) status = 'current'
            else status = 'locked'

            const disabled = status !== 'current'

            return (
              <li key={week}>
                <button
                  type="button"
                  className={
                    status === 'locked'
                      ? styles.menuLocked
                      : status === 'finished'
                        ? styles.menuFinished
                        : styles.menuItem
                  }
                  disabled={disabled}
                  onClick={() => {
                    if (status === 'current') onSelectWeek(week)
                  }}
                >
                  <span>第{week}週</span>
                  {status === 'locked' && (
                    <span className={styles.lockBadge}>ロック中</span>
                  )}
                  {status === 'current' && (
                    <span className={styles.openBadge}>プレイ</span>
                  )}
                  {status === 'finished' && (
                    <span className={styles.scoreBadge}>{score}点</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
        <button type="button" className={styles.secondaryBtn} onClick={onBack}>
          タイトルへ
        </button>
      </div>
    </div>
  )
}
