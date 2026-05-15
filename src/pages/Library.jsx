import { useMemo, useState } from 'react'
import { WORDS, CATEGORIES, TAG_LABELS } from '../data/words'
import WordDetailModal from '../components/WordDetailModal'

export default function Library() {
  const [cat, setCat] = useState('all')
  const [tag, setTag] = useState('all')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)

  const tags = useMemo(() => {
    const s = new Set()
    WORDS.forEach((w) => {
      if (cat === 'all' || w.category === cat) {
        w.tags?.forEach((t) => s.add(t))
      }
    })
    return Array.from(s)
  }, [cat])

  const list = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return WORDS.filter((w) => {
      if (cat !== 'all' && w.category !== cat) return false
      if (tag !== 'all' && !w.tags?.includes(tag)) return false
      if (!qq) return true
      return (
        w.en.toLowerCase().includes(qq) ||
        w.zh.includes(qq) ||
        w.example.toLowerCase().includes(qq)
      )
    })
  }, [cat, tag, q])

  return (
    <div className="space-y-3">
      {/* 搜尋 */}
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="🔍 搜尋英文 / 中文 / 例句"
        className="w-full px-4 py-3 rounded-duo border-2 border-gray-200 focus:border-duo-green outline-none font-semibold"
      />

      {/* 分類 chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Chip active={cat === 'all'} onClick={() => { setCat('all'); setTag('all') }}>
          全部
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.key}
            active={cat === c.key}
            onClick={() => { setCat(c.key); setTag('all') }}
          >
            {c.emoji} {c.label}
          </Chip>
        ))}
      </div>

      {/* 子標籤 */}
      {tags.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip small active={tag === 'all'} onClick={() => setTag('all')}>
            全部標籤
          </Chip>
          {tags.map((t) => (
            <Chip key={t} small active={tag === t} onClick={() => setTag(t)}>
              {TAG_LABELS[t] || t}
            </Chip>
          ))}
        </div>
      )}

      <div className="text-xs text-duo-gray font-bold">共 {list.length} 字</div>

      {/* 列表 */}
      {list.length === 0 ? (
        <div className="card-duo text-center py-10 text-duo-gray">
          沒有找到符合的單字
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((w) => (
            <li
              key={w.id}
              onClick={() => setSelected(w)}
              className="card-duo flex items-center justify-between cursor-pointer hover:border-duo-green transition"
            >
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-lg truncate">{w.en}</div>
                <div className="text-sm text-duo-gray truncate">{w.zh}</div>
              </div>
              <span className="text-xs text-duo-gray font-bold ml-2 shrink-0">
                {w.pos}
              </span>
            </li>
          ))}
        </ul>
      )}

      <WordDetailModal word={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function Chip({ active, onClick, children, small }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full font-bold transition border-2 ${
        small ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
      } ${
        active
          ? 'bg-duo-green text-white border-duo-green'
          : 'bg-white text-duo-ink border-gray-200'
      }`}
    >
      {children}
    </button>
  )
}
