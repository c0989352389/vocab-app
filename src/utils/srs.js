// 簡化版 SM-2 SRS 排程
// level: 0=未學, 1=青銅, 2=白銀, 3=黃金, 4=鑽石
// 答對升一級,答錯降一級(最低 0)
// 各等級下次複習間隔(天): [1, 1, 3, 7, 14, 30] (level 0~4 對應位置)
const INTERVALS = [1, 1, 3, 7, 14, 30]

export function todayStr(d = new Date()) {
  const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return tz.toISOString().slice(0, 10)
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return todayStr(d)
}

export function isDueToday(progress) {
  if (!progress) return false
  return progress.nextReviewAt <= todayStr()
}

export function applyAnswer(progress, correct) {
  const now = todayStr()
  const prev = progress || {
    level: 0,
    reviewCount: 0,
    correctCount: 0,
  }
  let level = prev.level || 0
  if (correct) {
    level = Math.min(4, level + 1)
  } else {
    level = Math.max(0, level - 1)
  }
  // 答錯 → 今天立即再複習; 答對 → 依等級間隔排程
  const interval = correct ? INTERVALS[Math.min(level, INTERVALS.length - 1)] : 0
  return {
    level,
    reviewCount: (prev.reviewCount || 0) + 1,
    correctCount: (prev.correctCount || 0) + (correct ? 1 : 0),
    lastReviewedAt: now,
    nextReviewAt: addDays(now, interval),
  }
}

export const LEVEL_META = [
  { name: '未學', color: '#AFAFAF', emoji: '⚪' },
  { name: '青銅', color: '#CD7F32', emoji: '🥉' },
  { name: '白銀', color: '#9CA3AF', emoji: '🥈' },
  { name: '黃金', color: '#FFC800', emoji: '🥇' },
  { name: '鑽石', color: '#1CB0F6', emoji: '💎' },
]
