import { WORDS } from '../data/words'
import { isDueToday } from './srs'

// 取得今日學習 session 的單字清單
// 規則: 先取「已學過但今日到期」的單字,不夠再補新字,總數 = limit
export function buildSession({ progress, limit, category, mode = 'normal' }) {
  const pool = category
    ? WORDS.filter((w) => w.category === category)
    : WORDS

  // 隨機複習模式: 已學過的字 (level>0) 加權抽樣,熟練度低的權重大
  // 權重: level 1→4, level 2→3, level 3→2, level 4→1 (越低越常被抽到)
  if (mode === 'random') {
    const learned = pool.filter((w) => (progress[w.id]?.level || 0) > 0)
    return weightedSample(learned, limit, (w) => 5 - (progress[w.id]?.level || 1))
  }

  const due = []
  const fresh = []
  for (const w of pool) {
    const p = progress[w.id]
    if (!p || (p.level || 0) === 0) {
      fresh.push(w)
    } else if (isDueToday(p)) {
      due.push(w)
    }
  }

  // 到期的優先 + 新字補滿
  const session = [...due, ...fresh].slice(0, limit)
  return shuffle(session)
}

// 不放回的加權抽樣
export function weightedSample(items, n, weightFn) {
  const pool = items.map((it) => ({ it, w: Math.max(0.01, weightFn(it)) }))
  const out = []
  for (let i = 0; i < n && pool.length > 0; i++) {
    const total = pool.reduce((s, p) => s + p.w, 0)
    let r = Math.random() * total
    let pickIdx = 0
    for (let j = 0; j < pool.length; j++) {
      r -= pool[j].w
      if (r <= 0) { pickIdx = j; break }
      pickIdx = j
    }
    out.push(pool[pickIdx].it)
    pool.splice(pickIdx, 1)
  }
  return out
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 從 WORDS 抽 n 個干擾選項 (排除 correctWord),回傳 [correct, ...wrong] 已洗牌
export function buildChoices(correctWord, n = 4) {
  const wrong = shuffle(
    WORDS.filter((w) => w.id !== correctWord.id && w.category === correctWord.category)
  ).slice(0, n - 1)
  return shuffle([correctWord, ...wrong])
}
