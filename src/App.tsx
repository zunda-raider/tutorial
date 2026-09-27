import { useCallback, useState } from 'react'
import { ExplanationScreen } from './components/ExplanationScreen'
import { HomeScreen } from './components/HomeScreen'
import { LearningMenu } from './components/LearningMenu'
import { QuestionScreen } from './components/QuestionScreen'
import { ScoringScreen } from './components/ScoringScreen'
import { TitleScreen } from './components/TitleScreen'
import {
  allProblemsSolved,
  firstUnsolvedProblem,
  logicTreeProblems,
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
  | { kind: 'title' }
  | { kind: 'home' }
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
  const problem = logicTreeProblems.find((p) => p.id === id)
  if (!problem) throw new Error(`Unknown problem: ${id}`)
  return problem
}

function App() {
  const [screen, setScreen] = useState<Screen>({ kind: 'title' })
  const [saveData, setSaveData] = useState<SaveData>(() => saveStore.load())

  const persist = useCallback((next: SaveData) => {
    setSaveData(next)
    saveStore.save(next)
  }, [])

  const solvedIds = new Set(Object.keys(saveData.problems))

  function goHome() {
    setScreen({ kind: 'home' })
  }

  function goTitle() {
    setScreen({ kind: 'title' })
  }

  function goMenu() {
    setScreen({ kind: 'menu' })
  }

  function startLogicTree() {
    const next = firstUnsolvedProblem(solvedIds)
    if (!next) return
    setScreen({ kind: 'question', problemId: next.id })
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
   * score ≤ AUTO_EXPLANATION_THRESHOLD → Explanation; otherwise Home.
   */
  function handleScoringGoHome(
    problemId: string,
    result: ScoringResult,
  ) {
    if (result.score <= AUTO_EXPLANATION_THRESHOLD) {
      showExplanation(problemId, result.targetAxisId)
      return
    }
    goHome()
  }

  function resetSave() {
    saveStore.clear()
    setSaveData({ ...EMPTY_SAVE, problems: {} })
  }

  return (
    <div className="app-shell">
      {screen.kind === 'title' && <TitleScreen onStart={goHome} />}

      {screen.kind === 'home' && (
        <HomeScreen
          saveData={saveData}
          onLearn={goMenu}
          onBackToTitle={goTitle}
          onResetSave={import.meta.env.DEV ? resetSave : undefined}
        />
      )}

      {screen.kind === 'menu' && (
        <LearningMenu
          allCleared={allProblemsSolved(solvedIds)}
          onSelectLogicTree={startLogicTree}
          onBack={goHome}
        />
      )}

      {screen.kind === 'question' && (
        <QuestionScreen
          key={screen.problemId}
          problem={requireProblem(screen.problemId)}
          questionNumber={
            logicTreeProblems.findIndex((p) => p.id === screen.problemId) + 1
          }
          totalQuestions={logicTreeProblems.length}
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
          onBackToHome={goHome}
        />
      )}
    </div>
  )
}

export default App
