import styles from './Screens.module.css'

type LearningMenuProps = {
  week: number
  onSelectLogicTree: () => void
  onBack: () => void
}

const ITEMS = [
  { id: 'logic-tree', label: 'ロジックツリー', locked: false },
  { id: 'fermi', label: 'フェルミ推定', locked: true },
  { id: 'new-biz', label: '新規事業立案', locked: true },
] as const

export function LearningMenu({
  week,
  onSelectLogicTree,
  onBack,
}: LearningMenuProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.panel}>
        <h1 className={styles.panelTitle}>学習メニュー</h1>
        <p className={styles.hint}>第{week}週 — 学びたいテーマを選んでください</p>
        <ul className={styles.menuList}>
          {ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={item.locked ? styles.menuLocked : styles.menuItem}
                disabled={item.locked}
                onClick={() => {
                  if (!item.locked) onSelectLogicTree()
                }}
              >
                <span>{item.label}</span>
                {item.locked ? (
                  <span className={styles.lockBadge}>ロック中</span>
                ) : (
                  <span className={styles.openBadge}>プレイ</span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className={styles.secondaryBtn} onClick={onBack}>
          スケジュールへ
        </button>
      </div>
    </div>
  )
}
