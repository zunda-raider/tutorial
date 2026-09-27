import styles from './Screens.module.css'

type EndScreenProps = {
  onBackToTitle: () => void
}

export function EndScreen({ onBackToTitle }: EndScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.heroCard}>
        <p className={styles.eyebrow}>クリア！</p>
        <h1 className={styles.title}>3問クリアしました</h1>
        <p className={styles.subtitle}>
          ロジックツリーの分解練習、おつかれさま！
        </p>
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
