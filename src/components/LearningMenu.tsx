import styles from './Screens.module.css'

type LearningMenuProps = {
  /** Lv1 (既存ロジックツリー) が全問クリア済み */
  lv1Cleared: boolean
  /** Lv2 が全問クリア済み */
  lv2Cleared: boolean
  /** Lv2 に1問でも進捗がある（Lv1未クリアでも継続できるように） */
  lv2Started: boolean
  onSelectLogicTreeLv1: () => void
  onSelectLogicTreeLv2: () => void
  onBack: () => void
}

type MenuItem = {
  id: string
  label: string
  locked: boolean
  cleared: boolean
  onSelect?: () => void
  lockHint?: string
}

export function LearningMenu({
  lv1Cleared,
  lv2Cleared,
  lv2Started,
  onSelectLogicTreeLv1,
  onSelectLogicTreeLv2,
  onBack,
}: LearningMenuProps) {
  const lv2Unlocked = lv1Cleared || lv2Started

  const items: MenuItem[] = [
    {
      id: 'logic-tree-lv1',
      label: 'ロジックツリー',
      locked: false,
      cleared: lv1Cleared,
      onSelect: onSelectLogicTreeLv1,
    },
    {
      id: 'logic-tree-lv2',
      label: 'ロジックツリー Lv2',
      locked: !lv2Unlocked,
      cleared: lv2Cleared,
      onSelect: onSelectLogicTreeLv2,
      lockHint: 'Lv1クリアで解放',
    },
    {
      id: 'fermi',
      label: 'フェルミ推定',
      locked: true,
      cleared: false,
      lockHint: 'ロック中',
    },
    {
      id: 'new-biz',
      label: '新規事業立案',
      locked: true,
      cleared: false,
      lockHint: 'ロック中',
    },
  ]

  return (
    <div className={styles.screen}>
      <div className={styles.panel}>
        <h1 className={styles.panelTitle}>学習メニュー</h1>
        <p className={styles.hint}>学びたいテーマを選んでください</p>
        <ul className={styles.menuList}>
          {items.map((item) => {
            const disabled = item.locked || item.cleared

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={
                    item.locked || item.cleared
                      ? styles.menuLocked
                      : styles.menuItem
                  }
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) item.onSelect?.()
                  }}
                >
                  <span>{item.label}</span>
                  {item.locked && (
                    <span className={styles.lockBadge}>
                      {item.lockHint ?? 'ロック中'}
                    </span>
                  )}
                  {item.cleared && (
                    <span className={styles.scoreBadge}>クリア済み</span>
                  )}
                  {!item.locked && !item.cleared && (
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
