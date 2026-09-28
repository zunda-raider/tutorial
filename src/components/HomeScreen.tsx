import { useMemo, useState } from 'react'
import {
  getProblemById,
  problemDisplayName,
  problemsForLevel,
} from '../data/logicTreeProblems'
import type { SaveData } from '../storage/save'
import { todayLocalDate } from '../storage/save'
import styles from './Screens.module.css'

type HomeScreenProps = {
  saveData: SaveData
  onLearn: () => void
  /** Dev-only reset; omit in production builds. */
  onResetSave?: () => void
}

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function toDateKey(year: number, monthIndex: number, day: number): string {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`
}

function formatDisplayDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return `${y}年${m}月${d}日`
}

export function HomeScreen({
  saveData,
  onLearn,
  onResetSave,
}: HomeScreenProps) {
  const todayKey = todayLocalDate()
  const today = useMemo(() => {
    const [y, m, d] = todayKey.split('-').map(Number)
    return { year: y, monthIndex: m - 1, day: d }
  }, [todayKey])

  const [viewYear, setViewYear] = useState(today.year)
  const [viewMonth, setViewMonth] = useState(today.monthIndex)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const solvedEntries = useMemo(
    () =>
      Object.entries(saveData.problems).map(([problemId, entry]) => ({
        problemId,
        ...entry,
      })),
    [saveData],
  )

  const markedDates = useMemo(() => {
    const set = new Set<string>()
    for (const e of solvedEntries) set.add(e.solvedDate)
    return set
  }, [solvedEntries])

  const lv1Problems = problemsForLevel(1)
  const lv2Problems = problemsForLevel(2)
  const lv1Done = lv1Problems.every((p) => saveData.problems[p.id])
  const lv2Done = lv2Problems.every((p) => saveData.problems[p.id])

  const selectedDayResults = useMemo(() => {
    if (!selectedDate) return []
    return solvedEntries
      .filter((e) => e.solvedDate === selectedDate)
      .map((e) => {
        const problem = getProblemById(e.problemId)
        return {
          problemId: e.problemId,
          name: problem ? problemDisplayName(problem) : e.problemId,
          score: e.score,
        }
      })
  }, [selectedDate, solvedEntries])

  function prevMonth() {
    setSelectedDate(null)
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    setSelectedDate(null)
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className={styles.screen}>
      <div className={styles.homePanel}>
        <p className={styles.eyebrow}>ホーム</p>
        <p className={styles.todayLarge}>{formatDisplayDate(todayKey)}</p>

        {/* Primary CTAs stay above calendar/scores so long content never buries them */}
        <div className={styles.homeActions}>
          <button type="button" className={styles.primaryBtn} onClick={onLearn}>
            学習メニューへ
          </button>
        </div>

        <section className={styles.calendar} aria-label="月カレンダー">
          <div className={styles.calHeader}>
            <button
              type="button"
              className={styles.calNav}
              onClick={prevMonth}
              aria-label="前の月"
            >
              ‹
            </button>
            <h2 className={styles.calTitle}>
              {viewYear}年{viewMonth + 1}月
            </h2>
            <button
              type="button"
              className={styles.calNav}
              onClick={nextMonth}
              aria-label="次の月"
            >
              ›
            </button>
          </div>
          <div className={styles.calWeekdays}>
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className={styles.calWeekday}>
                {label}
              </span>
            ))}
          </div>
          <div className={styles.calGrid}>
            {cells.map((day, idx) => {
              if (day === null) {
                return <span key={`e-${idx}`} className={styles.calEmpty} />
              }
              const key = toDateKey(viewYear, viewMonth, day)
              const isToday = key === todayKey
              const isMarked = markedDates.has(key)
              const isSelected = key === selectedDate
              return (
                <button
                  key={key}
                  type="button"
                  className={[
                    styles.calDay,
                    isToday ? styles.calToday : '',
                    isMarked ? styles.calMarked : '',
                    isSelected ? styles.calSelected : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={!isMarked}
                  onClick={() => {
                    if (isMarked) setSelectedDate(key)
                  }}
                  aria-label={
                    isMarked
                      ? `${viewMonth + 1}月${day}日（提出あり）`
                      : `${viewMonth + 1}月${day}日`
                  }
                >
                  {day}
                </button>
              )
            })}
          </div>
        </section>

        {selectedDate && (
          <section
            className={styles.dayDetail}
            aria-label={`${formatDisplayDate(selectedDate)}の提出`}
          >
            <h3 className={styles.dayDetailTitle}>
              {formatDisplayDate(selectedDate)}の提出
            </h3>
            <ul className={styles.scoreSummary}>
              {selectedDayResults.map((r) => (
                <li key={r.problemId}>
                  <span>{r.name}</span>
                  <strong>{r.score}点</strong>
                </li>
              ))}
            </ul>
          </section>
        )}

        {lv1Done && (
          <section className={styles.allScores} aria-label="Lv1スコア一覧">
            <h3 className={styles.dayDetailTitle}>
              ロジックツリー Lv1 クリア！スコア一覧
            </h3>
            <ul className={styles.scoreSummary}>
              {lv1Problems.map((p) => {
                const entry = saveData.problems[p.id]
                return (
                  <li key={p.id}>
                    <span>{problemDisplayName(p)}</span>
                    <strong>{entry ? `${entry.score}点` : '—'}</strong>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {lv2Done && (
          <section className={styles.allScores} aria-label="Lv2スコア一覧">
            <h3 className={styles.dayDetailTitle}>
              ロジックツリー Lv2 クリア！スコア一覧
            </h3>
            <ul className={styles.scoreSummary}>
              {lv2Problems.map((p) => {
                const entry = saveData.problems[p.id]
                return (
                  <li key={p.id}>
                    <span>{problemDisplayName(p)}</span>
                    <strong>{entry ? `${entry.score}点` : '—'}</strong>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {onResetSave && (
          <button
            type="button"
            className={styles.devResetBtn}
            onClick={onResetSave}
          >
            保存データをリセット
          </button>
        )}
      </div>
    </div>
  )
}
