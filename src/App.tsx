import { useState } from 'react'
import { AnswerScreen } from './components/AnswerScreen'
import { EndScreen } from './components/EndScreen'
import { LearningMenu } from './components/LearningMenu'
import { QuestionScreen } from './components/QuestionScreen'
import { ScheduleScreen } from './components/ScheduleScreen'
import { ScoringScreen } from './components/ScoringScreen'
import { TitleScreen } from './components/TitleScreen'
import {
  getProblemForWeek,
  TOTAL_WEEKS,
  type WeekNumber,
} from './data/logicTreeProblems'
import { scoreSubmission, type ScoringResult } from './logic/scoring'
import './App.css'

type Screen =
  | { kind: 'title' }
  | { kind: 'schedule' }
  | { kind: 'menu'; week: WeekNumber }
  | { kind: 'question'; week: WeekNumber }
  | {
      kind: 'scoring'
      week: WeekNumber
      placedCardIds: string[]
      result: ScoringResult
    }
  | {
      kind: 'answer'
      week: WeekNumber
      result: ScoringResult
    }
  | { kind: 'end' }

function App() {
  const [screen, setScreen] = useState<Screen>({ kind: 'title' })
  /** 1-based current week; advances after each week's answer screen. */
  const [currentWeek, setCurrentWeek] = useState<WeekNumber>(1)
  /** Score per week index (0..2); null = not yet finished. */
  const [weekScores, setWeekScores] = useState<(number | null)[]>(() =>
    Array.from({ length: TOTAL_WEEKS }, () => null),
  )

  function goTitle() {
    setScreen({ kind: 'title' })
    setCurrentWeek(1)
    setWeekScores(Array.from({ length: TOTAL_WEEKS }, () => null))
  }

  function goSchedule() {
    setScreen({ kind: 'schedule' })
  }

  function selectWeek(week: WeekNumber) {
    setScreen({ kind: 'menu', week })
  }

  function startLogicTree(week: WeekNumber) {
    setScreen({ kind: 'question', week })
  }

  function handleSubmit(week: WeekNumber, placedCardIds: string[]) {
    const problem = getProblemForWeek(week)
    const result = scoreSubmission(problem, placedCardIds)
    setWeekScores((prev) => {
      const next = [...prev]
      next[week - 1] = result.score
      return next
    })
    setScreen({ kind: 'scoring', week, placedCardIds, result })
  }

  function showAnswer(week: WeekNumber, result: ScoringResult) {
    setScreen({ kind: 'answer', week, result })
  }

  /**
   * From answer screen「スケジュールへ戻る」: advance week by 1.
   * After week 3 → end screen.
   */
  function finishWeekAndReturn(week: WeekNumber) {
    if (week >= TOTAL_WEEKS) {
      setScreen({ kind: 'end' })
      return
    }
    const nextWeek = (week + 1) as WeekNumber
    setCurrentWeek(nextWeek)
    setScreen({ kind: 'schedule' })
  }

  return (
    <div className="app-shell">
      {screen.kind === 'title' && <TitleScreen onStart={goSchedule} />}

      {screen.kind === 'schedule' && (
        <ScheduleScreen
          currentWeek={currentWeek}
          weekScores={weekScores}
          onSelectWeek={selectWeek}
          onBack={goTitle}
        />
      )}

      {screen.kind === 'menu' && (
        <LearningMenu
          week={screen.week}
          onSelectLogicTree={() => startLogicTree(screen.week)}
          onBack={goSchedule}
        />
      )}

      {screen.kind === 'question' && (
        <QuestionScreen
          key={`q-week-${screen.week}`}
          problem={getProblemForWeek(screen.week)}
          week={screen.week}
          onSubmit={(ids) => handleSubmit(screen.week, ids)}
        />
      )}

      {screen.kind === 'scoring' && (
        <ScoringScreen
          problem={getProblemForWeek(screen.week)}
          week={screen.week}
          placedCardIds={screen.placedCardIds}
          result={screen.result}
          onShowAnswer={() => showAnswer(screen.week, screen.result)}
        />
      )}

      {screen.kind === 'answer' && (
        <AnswerScreen
          problem={getProblemForWeek(screen.week)}
          week={screen.week}
          targetAxisId={screen.result.targetAxisId}
          onBackToSchedule={() => finishWeekAndReturn(screen.week)}
        />
      )}

      {screen.kind === 'end' && (
        <EndScreen weekScores={weekScores} onBackToTitle={goTitle} />
      )}
    </div>
  )
}

export default App
