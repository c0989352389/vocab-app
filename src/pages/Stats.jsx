import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { useStore } from '../store/useStore'
import { WORDS } from '../data/words'
import { LEVEL_META, todayStr } from '../utils/srs'

const HEATMAP_DAYS = 91 // 13 週

function dateBack(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return todayStr(d)
}

export default function Stats() {
  const progress = useStore((s) => s.progress)
  const dailyHistory = useStore((s) => s.dailyHistory)
  const streak = useStore((s) => s.streak)
  const gems = useStore((s) => s.gems)

  const levelCounts = useMemo(() => {
    const c = [0, 0, 0, 0, 0]
    for (const w of WORDS) {
      const lv = progress[w.id]?.level || 0
      c[lv]++
    }
    return c
  }, [progress])

  const learnedCount = WORDS.length - levelCounts[0]
  const masteredCount = levelCounts[4]

  const pieData = LEVEL_META.map((m, i) => ({
    name: m.name,
    value: levelCounts[i],
    color: m.color,
  })).filter((d) => d.value > 0)

  // 熱力圖資料: 過去 91 天
  const heat = useMemo(() => {
    const days = []
    for (let i = HEATMAP_DAYS - 1; i >= 0; i--) {
      const d = dateBack(i)
      days.push({ date: d, count: dailyHistory[d] || 0 })
    }
    return days
  }, [dailyHistory])

  const maxCount = Math.max(1, ...heat.map((d) => d.count))

  function heatColor(count) {
    if (count === 0) return '#EBEDF0'
    const t = Math.min(1, count / maxCount)
    if (t < 0.25) return '#9BE9A8'
    if (t < 0.5) return '#40C463'
    if (t < 0.75) return '#30A14E'
    return '#216E39'
  }

  return (
    <div className="space-y-4">
      {/* 總覽數字 */}
      <section className="grid grid-cols-2 gap-3">
        <Stat label="🔥 連勝" value={`${streak} 天`} />
        <Stat label="💎 寶石" value={gems} />
        <Stat label="✅ 已學會" value={`${learnedCount} / ${WORDS.length}`} />
        <Stat label="💎 鑽石級" value={masteredCount} />
      </section>

      {/* 熟練度分布 */}
      <section className="card-duo">
        <h2 className="font-extrabold mb-3">熟練度分布</h2>
        {pieData.length === 0 ? (
          <div className="text-center text-duo-gray text-sm py-6">尚無資料</div>
        ) : (
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="grid grid-cols-5 gap-1 mt-2 text-xs text-center">
          {LEVEL_META.map((m, i) => (
            <div key={i}>
              <div>{m.emoji}</div>
              <div className="font-bold">{levelCounts[i]}</div>
              <div className="text-duo-gray">{m.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 熱力圖 */}
      <section className="card-duo">
        <h2 className="font-extrabold mb-3">學習熱力圖 (近 13 週)</h2>
        <div className="overflow-x-auto">
          <div
            className="grid gap-[3px] w-fit"
            style={{ gridTemplateRows: 'repeat(7, 14px)', gridAutoFlow: 'column' }}
          >
            {heat.map((d) => (
              <div
                key={d.date}
                title={`${d.date} · ${d.count} 字`}
                className="w-[14px] h-[14px] rounded-sm"
                style={{ background: heatColor(d.count) }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-duo-gray">
          少
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ background: heatColor(i === 0 ? 0 : (i / 4) * maxCount) }}
            />
          ))}
          多
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="card-duo text-center py-3">
      <div className="text-xs text-duo-gray font-bold">{label}</div>
      <div className="text-xl font-extrabold mt-1">{value}</div>
    </div>
  )
}
