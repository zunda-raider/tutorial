import { useCallback, useState } from 'react'
import { ExplanationScreen } from './components/ExplanationScreen'
import { LearningMenu } from './components/LearningMenu'
import { QuestionScreen } from './components/QuestionScreen'
import { ScoringScreen } from './components/ScoringScreen'
import {
  allProblemsSolved,
  getProblemById,
  problemsForLevel,
} from './data/logicTreeProblems'
import {
  AUTO_EXPLANATION_THRESHOLD,
  scoreSubmission,
  type ScoringResult,
} from './logic/scoring'
import {
  EMPTY_SAVE,
  recordProblemResult,
  saveStore,
  type SaveData,
} from './storage/save'
import './App.css'

type Screen =
  | { kind: 'menu' }
  | { kind: 'question'; problemId: string }
  | {
      kind: 'scoring'
      problemId: string
      placedCardIds: string[]
      result: ScoringResult
    }
  | {
      kind: 'explanation'
      problemId: string
      targetAxisId: string | null
    }

function requireProblem(id: string) {
  const problem = getProblemById(id)
  if (!problem) throw new Error(`Unknown problem: ${id}`)
  return problem
}

function App() {
  // Unified home/learning screen (mentor + menu + calendar).
  const [screen, setScreen] = useState<Screen>({ kind: 'menu' })
  const [saveData, setSaveData] = useState<SaveData>(() => saveStore.load())

  const persist = useCallback((next: SaveData) => {
    setSaveData(next)
    saveStore.save(next)
  }, [])

  const solvedIds = new Set(Object.keys(saveData.problems))
  const lv1Cleared = allProblemsSolved(solvedIds, 1)
  const lv2Cleared = allProblemsSolved(solvedIds, 2)

  function goMenu() {
    setScreen({ kind: 'menu' })
  }

  function startProblem(problemId: string) {
    requireProblem(problemId)
    setScreen({ kind: 'question', problemId })
  }

  function handleSubmit(problemId: string, placedCardIds: string[]) {
    const problem = requireProblem(problemId)
    const result = scoreSubmission(problem, placedCardIds)
    const next = recordProblemResult(
      saveData,
      problemId,
      result.score,
      result.targetAxisId,
    )
    persist(next)
    setScreen({ kind: 'scoring', problemId, placedCardIds, result })
  }

  function showExplanation(problemId: string, targetAxisId: string | null) {
    setScreen({ kind: 'explanation', problemId, targetAxisId })
  }

  /**
   * From scoring「ホームへ戻る」:
   * score ≤ AUTO_EXPLANATION_THRESHOLD → Explanation; otherwise menu.
   */
  function handleScoringGoHome(
    problemId: string,
    result: ScoringResult,
  ) {
    if (result.score <= AUTO_EXPLANATION_THRESHOLD) {
      showExplanation(problemId, result.targetAxisId)
      return
    }
    goMenu()
  }

  function resetSave() {
    saveStore.clear()
    setSaveData({ ...EMPTY_SAVE, problems: {} })
  }

  const questionProblem =
    screen.kind === 'question' ? requireProblem(screen.problemId) : null
  const levelProblems = questionProblem
    ? problemsForLevel(questionProblem.level)
    : []

  return (
    <div className="app-shell">
      {screen.kind === 'menu' && (
        <LearningMenu
          saveData={saveData}
          lv1Cleared={lv1Cleared}
          lv2Cleared={lv2Cleared}
          lv2Started={problemsForLevel(2).some((p) => solvedIds.has(p.id))}
          onSelectProblem={startProblem}
          onResetSave={import.meta.env.DEV ? resetSave : undefined}
        />
      )}

      {screen.kind === 'question' && questionProblem && (
        <QuestionScreen
          key={screen.problemId}
          problem={questionProblem}
          questionNumber={
            levelProblems.findIndex((p) => p.id === screen.problemId) + 1
          }
          totalQuestions={levelProblems.length}
          onSubmit={(ids) => handleSubmit(screen.problemId, ids)}
        />
      )}

      {screen.kind === 'scoring' && (
        <ScoringScreen
          problem={requireProblem(screen.problemId)}
          placedCardIds={screen.placedCardIds}
          result={screen.result}
          onShowExplanation={() =>
            showExplanation(screen.problemId, screen.result.targetAxisId)
          }
          onGoHome={() => handleScoringGoHome(screen.problemId, screen.result)}
        />
      )}

      {screen.kind === 'explanation' && (
        <ExplanationScreen
          problem={requireProblem(screen.problemId)}
          targetAxisId={screen.targetAxisId}
          onBackToHome={goMenu}
        />
      )}
    </div>
  )
}

export default App
