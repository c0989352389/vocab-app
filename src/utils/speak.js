// Google TTS 為主, SpeechSynthesis 為備援
// 相同文字 4 秒內再按 → 自動放慢 (像 Google Translate)
let currentAudio = null
const lastPlay = new Map() // text -> timestamp

export function speak(text, opts = {}) {
  if (!text || typeof window === 'undefined') return

  try { currentAudio?.pause(); window.speechSynthesis?.cancel() } catch {}

  const key = text.toLowerCase().trim()
  const now = Date.now()
  const prev = lastPlay.get(key) || 0
  const isRepeat = now - prev < 4000
  lastPlay.set(key, now)

  // Google TTS: ttsspeed=0.24 是慢速
  const url =
    'https://translate.google.com/translate_tts?ie=UTF-8' +
    `&q=${encodeURIComponent(text)}` +
    `&tl=${opts.lang || 'en'}` +
    (isRepeat ? '&ttsspeed=0.24' : '') +
    '&client=tw-ob'

  try {
    const a = new Audio(url)
    a.crossOrigin = 'anonymous'
    currentAudio = a
    const p = a.play()
    if (p && p.catch) p.catch(() => fallback(text, opts, isRepeat))
  } catch {
    fallback(text, opts, isRepeat)
  }
}

function fallback(text, opts, slow) {
  try {
    if (!window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = opts.lang === 'en' ? 'en-US' : opts.lang || 'en-US'
    u.rate = slow ? 0.55 : 0.95
    window.speechSynthesis.speak(u)
  } catch (e) {
    console.warn('speak fallback failed', e)
  }
}
