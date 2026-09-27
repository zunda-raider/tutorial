import { TOTAL_WEEKS } from '../data/logicTreeProblems'
import styles from './Screens.module.css'

type EndScreenProps = {
  weekScores: (number | null)[]
  onBackToTitle: () => void
}

export function EndScreen({ weekScores, onBackToTitle }: EndScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.heroCard}>
        <p className={styles.eyebrow}>全週クリア！</p>
        <h1 className={styles.title}>3週間おつかれさま</h1>
        <p className={styles.subtitle}>各週のスコア</p>
        <ul className={styles.scoreSummary}>
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
            <li key={i}>
              <span>第{i + 1}週</span>
              <strong>{weekScores[i] ?? '—'}点</strong>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={onBackToTitle}
        >
          タイトルへ戻る
        </button>
      </div>
    </div>
  )
}
