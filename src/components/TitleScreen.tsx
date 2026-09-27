import styles from './Screens.module.css'

type TitleScreenProps = {
  onStart: () => void
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.heroCard}>
        <p className={styles.eyebrow}>経営ゲーム</p>
        <h1 className={styles.title}>ロジックツリー学習</h1>
        <p className={styles.subtitle}>
          3週間でMECEな切り口を身につけよう
        </p>
        <button type="button" className={styles.primaryBtn} onClick={onStart}>
          はじめる
        </button>
      </div>
    </div>
  )
}
