import styles from './Screens.module.css'

type LearningMenuProps = {
  /** When true, ロジックツリー is shown as cleared (no retry). */
  allCleared: boolean
  onSelectLogicTree: () => void
  onBack: () => void
}

const ITEMS = [
  { id: 'logic-tree', label: 'ロジックツリー', locked: false },
  { id: 'fermi', label: 'フェルミ推定', locked: true },
  { id: 'new-biz', label: '新規事業立案', locked: true },
] as const

export function LearningMenu({
  allCleared,
  onSelectLogicTree,
  onBack,
}: LearningMenuProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.panel}>
        <h1 className={styles.panelTitle}>学習メニュー</h1>
        <p className={styles.hint}>学びたいテーマを選んでください</p>
        <ul className={styles.menuList}>
          {ITEMS.map((item) => {
            const isLogic = item.id === 'logic-tree'
            const locked = item.locked
            const cleared = isLogic && allCleared
            const disabled = locked || cleared

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={
                    locked || cleared ? styles.menuLocked : styles.menuItem
                  }
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) onSelectLogicTree()
                  }}
                >
                  <span>{item.label}</span>
                  {locked && <span className={styles.lockBadge}>ロック中</span>}
                  {cleared && (
                    <span className={styles.scoreBadge}>クリア済み</span>
                  )}
                  {!locked && !cleared && (
                    <span className={styles.openBadge}>プレイ</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
        <button type="button" className={styles.secondaryBtn} onClick={onBack}>
          ホームへ
        </button>
      </div>
    </div>
  )
}
