import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function TopBar() {
  const streak = useStore((s) => s.streak)
  const gems = useStore((s) => s.gems)
  const checkDateRollover = useStore((s) => s.checkDateRollover)

  useEffect(() => {
    checkDateRollover()
  }, [checkDateRollover])

  return (
    <header className="sticky top-0 z-10 bg-white border-b-2 border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="font-extrabold text-xl text-duo-green">VocaBoost</h1>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="flex items-center gap-1">🔥 <span>{streak}</span></span>
          <span className="flex items-center gap-1">💎 <span>{gems}</span></span>
        </div>
      </div>
    </header>
  )
}
