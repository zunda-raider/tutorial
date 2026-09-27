import { useState } from 'react'
import { EndScreen } from './components/EndScreen'
import { LearningMenu } from './components/LearningMenu'
import { QuestionScreen } from './components/QuestionScreen'
import { TitleScreen } from './components/TitleScreen'
import { logicTreeProblems } from './data/logicTreeProblems'
import './App.css'

type Screen =
  | { kind: 'title' }
  | { kind: 'menu' }
  | { kind: 'question'; index: number }
  | { kind: 'end' }

function App() {
  const [screen, setScreen] = useState<Screen>({ kind: 'title' })

  function goTitle() {
    setScreen({ kind: 'title' })
  }

  function goMenu() {
    setScreen({ kind: 'menu' })
  }

  function startLogicTree() {
    setScreen({ kind: 'question', index: 0 })
  }

  function goNextQuestion(currentIndex: number) {
    const next = currentIndex + 1
    if (next >= logicTreeProblems.length) {
      setScreen({ kind: 'end' })
    } else {
      setScreen({ kind: 'question', index: next })
    }
  }

  return (
    <div className="app-shell">
      {screen.kind === 'title' && <TitleScreen onStart={goMenu} />}
      {screen.kind === 'menu' && (
        <LearningMenu onSelectLogicTree={startLogicTree} onBack={goTitle} />
      )}
      {screen.kind === 'question' && (
        <QuestionScreen
          key={logicTreeProblems[screen.index].id}
          problem={logicTreeProblems[screen.index]}
          questionIndex={screen.index}
          totalQuestions={logicTreeProblems.length}
          onNext={() => goNextQuestion(screen.index)}
        />
      )}
      {screen.kind === 'end' && <EndScreen onBackToTitle={goTitle} />}
    </div>
  )
}

export default App
