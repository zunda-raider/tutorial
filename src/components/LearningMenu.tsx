import { useEffect, useMemo, useState } from 'react'
import {
  problemDisplayName,
  problemsForLevel,
  type LogicTreeProblem,
  type ProblemLevel,
} from '../data/logicTreeProblems'
import { todayLocalDate, type SaveData } from '../storage/save'
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

const MENTOR_LINE =
  '今日のおすすめだよ。カードをタップして始めよう！'

function formatDisplayDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return `${y}年${m}月${d}日`
}

/** Prefer next unsolved unlocked problem; else first unlocked for replay. */
function pickFeaturedProblem(
  saveData: SaveData,
  lv2Unlocked: boolean,
): LogicTreeProblem | null {
  const pool = [
    ...problemsForLevel(1),
    ...(lv2Unlocked ? problemsForLevel(2) : []),
  ]
  if (pool.length === 0) return null
  const unsolved = pool.find((p) => !saveData.problems[p.id])
  return unsolved ?? pool[0]
}

export function LearningMenu({
  saveData,
  lv1Cleared,
  lv2Cleared,
  lv2Started,
  onSelectProblem,
  onResetSave,
}: LearningMenuProps) {
  const lv2Unlocked = lv1Cleared || lv2Started
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [learnOpen, setLearnOpen] = useState(true)
  const [expandedLevel, setExpandedLevel] = useState<ProblemLevel | null>(1)

  const todayKey = todayLocalDate()
  const featured = useMemo(
    () => pickFeaturedProblem(saveData, lv2Unlocked),
    [saveData, lv2Unlocked],
  )
  const featuredSolved = featured
    ? Boolean(saveData.problems[featured.id])
    : false

  const lv1Problems = problemsForLevel(1)
  const lv2Problems = problemsForLevel(2)
  const lv1SolvedCount = lv1Problems.filter((p) => saveData.problems[p.id])
    .length
  const lv2SolvedCount = lv2Problems.filter((p) => saveData.problems[p.id])
    .length
  const solvedToday = Object.values(saveData.problems).filter(
    (e) => e.solvedDate === todayKey,
  ).length

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

  function closeDrawer() {
    setDrawerOpen(false)
  }

  function openProblem(problemId: string) {
    closeDrawer()
    onSelectProblem(problemId)
  }

  // Escape closes the drawer
  useEffect(() => {
    if (!drawerOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  // Lock body scroll while drawer is open (phone)
  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen])

  return (
    <div className={styles.homeScroll}>
      {/* 1. Top chrome */}
      <header className={styles.topChrome}>
        <button
          type="button"
          className={styles.hamburger}
          aria-label="メニューを開く"
          aria-expanded={drawerOpen}
          aria-controls="home-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <span className={styles.hamburgerBar} aria-hidden="true" />
          <span className={styles.hamburgerBar} aria-hidden="true" />
          <span className={styles.hamburgerBar} aria-hidden="true" />
        </button>
        <p className={styles.topTitle}>ホーム</p>
        <span className={styles.topChromeSpacer} aria-hidden="true" />
      </header>

      {/* Drawer: 学習 → themes → problems */}
      {drawerOpen && (
        <div
          className={styles.drawerBackdrop}
          role="presentation"
          onClick={closeDrawer}
        />
      )}
      <nav
        id="home-drawer"
        className={[
          styles.drawer,
          drawerOpen ? styles.drawerOpen : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="メインメニュー"
        aria-hidden={!drawerOpen}
      >
        <div className={styles.drawerHeader}>
          <p className={styles.drawerHeading}>メニュー</p>
          <button
            type="button"
            className={styles.drawerClose}
            aria-label="メニューを閉じる"
            onClick={closeDrawer}
          >
            ×
          </button>
        </div>

        <button
          type="button"
          className={styles.drawerSectionBtn}
          aria-expanded={learnOpen}
          onClick={() => setLearnOpen((v) => !v)}
        >
          <span>学習</span>
          <span className={styles.drawerChevron} aria-hidden="true">
            {learnOpen ? '▾' : '▸'}
          </span>
        </button>

        {learnOpen && (
          <ul className={styles.drawerThemeList}>
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
                            ? 'クリア済み'
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
                              onClick={() => openProblem(problem.id)}
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
        )}

        <p className={styles.drawerHint}>
          テーマを開き、解きたい問題を選んでください（クリア済みも再挑戦可）
        </p>
      </nav>

      {/* 2. Hero: 美椎 LEFT presenting problem card RIGHT */}
      <section className={styles.heroStage} aria-label="おすすめ問題">
        <div className={styles.heroCharacter}>
          <Mentor message={MENTOR_LINE} size="presenting" />
        </div>
        {featured && (
          <button
            type="button"
            className={styles.heroProblemCard}
            onClick={() => openProblem(featured.id)}
          >
            <span className={styles.heroCardEyebrow}>
              Lv{featured.level}
              {featuredSolved ? ' · 再挑戦' : ' · おすすめ'}
            </span>
            <span className={styles.heroCardTitle}>
              {problemDisplayName(featured)}
            </span>
            <span className={styles.heroCardBody}>
              {featured.problemStatement}
            </span>
            <span className={styles.heroCardCta}>
              {featuredSolved ? 'もう一度解く' : '挑戦する'}
            </span>
          </button>
        )}
      </section>

      <p className={styles.heroSpeech} role="status">
        {MENTOR_LINE}
      </p>

      {/* 3. Today + progress summary */}
      <section className={styles.progressSummary} aria-label="本日の進捗">
        <p className={styles.eyebrow}>きょう</p>
        <p className={styles.todayLarge}>{formatDisplayDate(todayKey)}</p>
        <ul className={styles.progressStats}>
          <li>
            <span className={styles.statLabel}>今日の提出</span>
            <strong className={styles.statValue}>{solvedToday}</strong>
          </li>
          <li>
            <span className={styles.statLabel}>Lv1</span>
            <strong className={styles.statValue}>
              {lv1SolvedCount}/{lv1Problems.length}
            </strong>
          </li>
          <li>
            <span className={styles.statLabel}>Lv2</span>
            <strong className={styles.statValue}>
              {lv2Unlocked
                ? `${lv2SolvedCount}/${lv2Problems.length}`
                : '🔒'}
            </strong>
          </li>
        </ul>
      </section>

      {/* 4. Calendar */}
      <div className={styles.homePanel}>
        <CalendarProgress
          saveData={saveData}
          onResetSave={onResetSave}
          showDateHeader={false}
        />
      </div>
    </div>
  )
}

