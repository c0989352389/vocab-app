import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { buildSession } from '../utils/session'
import { sfx } from '../utils/sound'
import FlipCard from '../components/learn/FlipCard'
import ListenType from '../components/learn/ListenType'
import SessionResult from '../components/learn/SessionResult'
import ComboFlash from '../components/learn/ComboFlash'
import GoalCelebration from '../components/GoalCelebration'

const MODES = ['flip', 'listen']

export default function Learn() {
  const [params] = useSearchParams()
  const category = params.get('category')
  const mode = params.get('mode') || 'normal'
  const dailyGoal = useStore((s) => s.dailyGoal)
  const answer = useStore((s) => s.answer)
  const gemsBefore = useStore((s) => s.gems)

  const [session, setSession] = useState(() =>
    buildSession({ progress: useStore.getState().progress, limit: dailyGoal, category, mode })
  )
  const [idx, setIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [combo, setCombo] = useState(0)
  const [flashMsg, setFlashMsg] = useState('')
  const [showGoal, setShowGoal] = useState(false)
  const [startGems] = useState(gemsBefore)
  const [finished, setFinished] = useState(false)

  const current = session[idx]
  const qType = MODES[idx % MODES.length]

  function handleAnswer(correct) {
    if (!current) return
    const nextCombo = correct ? combo + 1 : 0
    const event = answer(current.id, correct, nextCombo)
    setCombo(nextCombo)

    // 音效 + flash
    if (correct) {
      if (event.comboBonus > 0) {
        sfx.combo()
        setFlashMsg(`🔥 連對 ${nextCombo}! +${event.gemsDelta} 💎`)
      } else {
        sfx.correct()
        if (nextCombo >= 3) setFlashMsg(`連對 ${nextCombo} +${event.gemsDelta} 💎`)
        else setFlashMsg(`+${event.gemsDelta} 💎`)
      }
      setCorrectCount((n) => n + 1)
    } else {
      sfx.wrong()
      setFlashMsg(`+${event.gemsDelta} 💎`)
    }

    if (event.goalReached) {
      sfx.goal()
      setShowGoal(true)
    }
    if (event.streakMilestone > 0) {
      setTimeout(() => setFlashMsg(`🔥 連勝 ${event.streakMilestone} 天!`), 300)
    }

    if (idx + 1 >= session.length) {
      setTimeout(() => setFinished(true), 400)
    } else {
      setIdx(idx + 1)
    }
  }

  function restart() {
    const fresh = buildSession({
      progress: useStore.getState().progress,
      limit: dailyGoal,
      category,
      mode,
    })
    setSession(fresh)
    setIdx(0)
    setCorrectCount(0)
    setCombo(0)
    setFinished(false)
  }

  if (session.length === 0) {
    return (
      <div className="card-duo text-center py-12 space-y-3">
        <div className="text-5xl">🎯</div>
        <h2 className="font-extrabold text-xl">沒有可學的單字</h2>
        <p className="text-duo-gray text-sm">
          {mode === 'random' ? '你還沒學過任何單字,先去學習吧!' : '所有單字今日都複習完囉,明天再來!'}
        </p>
        <Link to="/" className="btn-primary inline-block mt-2">回首頁</Link>
      </div>
    )
  }

  if (finished) {
    const gemsEarned = useStore.getState().gems - startGems
    return (
      <>
        <SessionResult
          total={session.length}
          correct={correctCount}
          gemsEarned={gemsEarned}
          onRestart={restart}
        />
        <GoalCelebration show={showGoal} onDone={() => setShowGoal(false)} />
      </>
    )
  }

  const progressPct = (idx / session.length) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-2xl text-duo-gray">✕</Link>
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-duo-green transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-xs font-bold text-duo-gray">
          {idx + 1}/{session.length}
        </div>
      </div>

      {combo >= 3 && (
        <div className="text-center text-duo-gold font-extrabold text-sm">
          🔥 連對 {combo}
        </div>
      )}

      {qType === 'flip' ? (
        <FlipCard key={current.id} word={current} onAnswer={handleAnswer} />
      ) : (
        <ListenType key={current.id} word={current} onAnswer={handleAnswer} />
      )}

      <ComboFlash message={flashMsg} />
      <GoalCelebration show={showGoal} onDone={() => setShowGoal(false)} />
    </div>
  )
}
