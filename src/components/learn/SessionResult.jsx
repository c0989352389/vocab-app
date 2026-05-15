import { Link } from 'react-router-dom'

export default function SessionResult({ total, correct, gemsEarned, onRestart }) {
  const pct = total ? Math.round((correct / total) * 100) : 0
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="text-7xl">🎉</div>
      <h2 className="text-2xl font-extrabold">今日學習完成！</h2>

      <div className="grid grid-cols-3 gap-3 w-full">
        <Stat label="完成數" value={total} />
        <Stat label="正確率" value={`${pct}%`} />
        <Stat label="獲得寶石" value={`+${gemsEarned}`} accent />
      </div>

      <div className="w-full space-y-3">
        <button onClick={onRestart} className="btn-secondary w-full">再來一輪</button>
        <Link to="/" className="btn-primary w-full block">回首頁</Link>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className={`card-duo py-4 ${accent ? 'border-duo-gold' : ''}`}>
      <div className={`text-2xl font-extrabold ${accent ? 'text-duo-gold' : ''}`}>{value}</div>
      <div className="text-xs text-duo-gray font-bold mt-1">{label}</div>
    </div>
  )
}
