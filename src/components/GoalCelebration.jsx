import { useEffect, useState } from 'react'

const EMOJIS = ['🎉', '✨', '⭐', '💎', '🔥', '🏆', '🥇']

export default function GoalCelebration({ show, onDone }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!show) return
    const arr = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: Math.random() * 90 + 5,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1,
    }))
    setPieces(arr)
    const t = setTimeout(() => {
      setPieces([])
      onDone?.()
    }, 2800)
    return () => clearTimeout(t)
  }, [show, onDone])

  if (!show || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes vb-fall {
          0% { transform: translateY(-20vh) rotate(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes vb-pop {
          0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0; }
          40% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute text-3xl"
          style={{
            left: `${p.left}%`,
            top: 0,
            animation: `vb-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        >
          {p.emoji}
        </div>
      ))}
      <div
        className="absolute top-1/2 left-1/2 bg-duo-green text-white px-8 py-5 rounded-duo shadow-2xl font-extrabold text-2xl text-center"
        style={{ animation: 'vb-pop 0.5s ease-out forwards' }}
      >
        🎯 達成今日目標!
      </div>
    </div>
  )
}
