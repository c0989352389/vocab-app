import { useRef, useState } from 'react'
import { useStore } from '../store/useStore'

const GOAL_OPTIONS = [10, 20, 30, 50]

export default function Settings() {
  const dailyGoal = useStore((s) => s.dailyGoal)
  const setDailyGoal = useStore((s) => s.setDailyGoal)
  const resetAll = useStore((s) => s.resetAll)
  const importData = useStore((s) => s.importData)
  const fileRef = useRef(null)
  const [msg, setMsg] = useState('')

  function exportJSON() {
    const data = useStore.getState()
    const exportObj = {
      progress: data.progress,
      dailyHistory: data.dailyHistory,
      streak: data.streak,
      gems: data.gems,
      dailyGoal: data.dailyGoal,
      lastStudyDate: data.lastStudyDate,
      todayLearned: data.todayLearned,
      todayDate: data.todayDate,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vocaboost-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    flash('已匯出備份')
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!confirm('確定要匯入?目前資料會被覆蓋。')) return
        const ok = importData(data)
        flash(ok ? '✅ 已匯入備份' : '❌ 資料格式錯誤')
      } catch {
        flash('❌ JSON 解析失敗')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleReset() {
    if (!confirm('確定要清空所有進度?此操作不可復原。')) return
    if (!confirm('真的確定?所有學習紀錄將被刪除。')) return
    resetAll()
    flash('已重置')
  }

  function flash(text) {
    setMsg(text)
    setTimeout(() => setMsg(''), 2000)
  }

  return (
    <div className="space-y-4">
      <section className="card-duo">
        <h2 className="font-extrabold mb-3">每日目標</h2>
        <div className="grid grid-cols-4 gap-2">
          {GOAL_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setDailyGoal(n)}
              className={`py-3 rounded-duo font-extrabold border-2 transition ${
                dailyGoal === n
                  ? 'bg-duo-green text-white border-duo-green'
                  : 'bg-white border-gray-200 text-duo-ink'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      <section className="card-duo space-y-3">
        <h2 className="font-extrabold">資料備份</h2>
        <button onClick={exportJSON} className="btn-secondary w-full">
          ⬇️ 匯出 JSON
        </button>
        <button onClick={() => fileRef.current?.click()} className="btn-secondary w-full">
          ⬆️ 匯入 JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImport}
        />
      </section>

      <section className="card-duo space-y-3">
        <h2 className="font-extrabold text-duo-red">危險區</h2>
        <button
          onClick={handleReset}
          className="btn-duo w-full bg-white text-duo-red border-2 border-duo-red shadow-duo active:shadow-none"
        >
          🗑️ 重置所有進度
        </button>
      </section>

      <section className="text-center text-xs text-duo-gray pt-2">
        VocaBoost · 自製英文單字學習 App
      </section>

      {msg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-duo-ink text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-50">
          {msg}
        </div>
      )}
    </div>
  )
}
