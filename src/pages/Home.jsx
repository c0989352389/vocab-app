import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { WORDS } from '../data/words'
import { useStore } from '../store/useStore'
import { isDueToday } from '../utils/srs'

export default function Home() {
  const dailyGoal = useStore((s) => s.dailyGoal)
  const todayLearned = useStore((s) => s.todayLearned)
  const progress = useStore((s) => s.progress)

  const convCount = WORDS.filter((w) => w.category === 'conversation').length
  const aiCount = WORDS.filter((w) => w.category === 'ai-coding').length

  const dueCount = useMemo(() => {
    let n = 0
    for (const w of WORDS) {
      const p = progress[w.id]
      if (!p || (p.level || 0) === 0) continue
      if (isDueToday(p)) n++
    }
    return n
  }, [progress])

  const newCount = useMemo(
    () => WORDS.filter((w) => !progress[w.id] || (progress[w.id].level || 0) === 0).length,
    [progress]
  )

  const pct = Math.min(100, (todayLearned / dailyGoal) * 100)

  return (
    <div className="space-y-4">
      <section className="card-duo">
        <div className="flex items-end justify-between mb-2">
          <h2 className="font-extrabold text-lg">今日目標</h2>
          <span className="text-sm text-duo-gray font-bold">
            {todayLearned} / {dailyGoal}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-duo-green transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-duo-gray font-bold">
          <span>📅 到期複習 {dueCount}</span>
          <span>✨ 新字 {newCount}</span>
        </div>
      </section>

      <Link to="/learn" className="btn-primary w-full text-lg py-4">
        開始今日學習
      </Link>

      <Link to="/learn?mode=random" className="btn-secondary w-full">
        🔁 隨機複習已學過的字
      </Link>

      <section className="grid grid-cols-2 gap-3">
        <Link to="/learn?category=conversation" className="card-duo text-center hover:border-duo-green transition">
          <div className="text-4xl mb-1">💬</div>
          <div className="font-extrabold">通用會話</div>
          <div className="text-xs text-duo-gray mt-1">{convCount} 字</div>
        </Link>
        <Link to="/learn?category=ai-coding" className="card-duo text-center hover:border-duo-green transition">
          <div className="text-4xl mb-1">🤖</div>
          <div className="font-extrabold">AI 程式</div>
          <div className="text-xs text-duo-gray mt-1">{aiCount} 字</div>
        </Link>
      </section>
    </div>
  )
}
