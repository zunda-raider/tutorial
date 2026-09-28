import { useState } from 'react'
import {
  problemDisplayName,
  problemsForLevel,
  type ProblemLevel,
} from '../data/logicTreeProblems'
import type { SaveData } from '../storage/save'
import { CalendarProgress } from './CalendarProgress'
import { Mentor } from './Mentor'
import styles from './Screens.module.css'

type LearningMenuProps = {
  saveData: SaveData
  /** Lv1 (既存ロジックツリー) が全問クリア済み */
  lv1Cleared: boolean
  /** Lv2 が全問クリア済み */
  lv2Cleared: boolean
  /** Lv2 に1問でも進捗がある（Lv1未クリアでも継続できるように） */
  lv2Started: boolean
  onSelectProblem: (problemId: string) => void
  /** Dev-only reset; omit in production builds. */
  onResetSave?: () => void
}

type ThemeItem = {
  id: string
  label: string
  locked: boolean
  cleared: boolean
  level?: ProblemLevel
  lockHint?: string
}

const MENTOR_WELCOME =
  'こんにちは！テーマを開いて、解きたい問題を選んでみましょう。'

export function LearningMenu({
  saveData,
  lv1Cleared,
  lv2Cleared,
  lv2Started,
  onSelectProblem,
  onResetSave,
}: LearningMenuProps) {
  const lv2Unlocked = lv1Cleared || lv2Started
  // Default-expand Lv1 so the theme is obviously interactive
  const [expandedLevel, setExpandedLevel] = useState<ProblemLevel | null>(1)

  const items: ThemeItem[] = [
    {
      id: 'logic-tree-lv1',
      label: 'ロジックツリー',
      locked: false,
      cleared: lv1Cleared,
      level: 1,
    },
    {
      id: 'logic-tree-lv2',
      label: 'ロジックツリー Lv2',
      locked: !lv2Unlocked,
      cleared: lv2Cleared,
      level: 2,
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

  function toggleLevel(level: ProblemLevel) {
    setExpandedLevel((prev) => (prev === level ? null : level))
  }

  return (
    <div className={styles.homeScroll}>
      {/* 1. Mentor hero — 美椎 large above the fold */}
      <header className={styles.homeHero}>
        <Mentor message={MENTOR_WELCOME} size="hero" />
      </header>

      {/* 2. Learning themes / problems */}
      <section className={styles.panel} aria-label="学習メニュー">
        <h1 className={styles.panelTitle}>学習メニュー</h1>
        <p className={styles.hint}>
          テーマを開き、解きたい問題を選んでください（クリア済みも再挑戦可）
        </p>
        <ul className={styles.menuList}>
          {items.map((item) => {
            const isExpandable = item.level !== undefined && !item.locked
            const isExpanded =
              isExpandable && expandedLevel === item.level

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={
                    item.locked
                      ? styles.menuLocked
                      : item.cleared
                        ? styles.menuFinished
                        : styles.menuItem
                  }
                  disabled={item.locked}
                  aria-expanded={isExpandable ? isExpanded : undefined}
                  onClick={() => {
                    if (!isExpandable || item.level === undefined) return
                    toggleLevel(item.level)
                  }}
                >
                  <span>{item.label}</span>
                  {item.locked && (
                    <span className={styles.lockBadge}>
                      {item.lockHint ?? 'ロック中'}
                    </span>
                  )}
                  {!item.locked && (
                    <span
                      className={
                        item.cleared ? styles.scoreBadge : styles.openBadge
                      }
                    >
                      {isExpanded
                        ? '閉じる'
                        : item.cleared
                          ? 'クリア済み・再プレイ'
                          : '問題を選ぶ'}
                    </span>
                  )}
                </button>

                {isExpanded && item.level !== undefined && (
                  <ul
                    className={styles.problemList}
                    aria-label={`${item.label}の問題一覧`}
                  >
                    {problemsForLevel(item.level).map((problem, index) => {
                      const entry = saveData.problems[problem.id]
                      const solved = Boolean(entry)
                      return (
                        <li key={problem.id}>
                          <button
                            type="button"
                            className={styles.problemItem}
                            onClick={() => onSelectProblem(problem.id)}
                          >
                            <span className={styles.problemLabel}>
                              <span className={styles.problemIndex}>
                                Q{index + 1}
                              </span>
                              {problemDisplayName(problem)}
                            </span>
                            {solved ? (
                              <span className={styles.scoreBadge}>
                                {entry.score}点・再挑戦
                              </span>
                            ) : (
                              <span className={styles.openBadge}>挑戦</span>
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {/* 3. Calendar + progress (former Home) */}
      <div className={styles.homePanel}>
        <CalendarProgress saveData={saveData} onResetSave={onResetSave} />
      </div>
    </div>
  )
}
