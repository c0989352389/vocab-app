// 多層 fallback: Google TTS → 瀏覽器合成
// 手機 Google TTS 常被擋,所以加上 timeout + error 監聽
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

  const url =
    'https://translate.google.com/translate_tts?ie=UTF-8' +
    `&q=${encodeURIComponent(text)}` +
    `&tl=${opts.lang || 'en'}` +
    (isRepeat ? '&ttsspeed=0.24' : '') +
    '&client=tw-ob'

  let fellBack = false
  function goFallback() {
    if (fellBack) return
    fellBack = true
    try { currentAudio?.pause() } catch {}
    fallback(text, opts, isRepeat)
  }

  try {
    const a = new Audio()
    a.src = url
    // 不設 crossOrigin: 純播放不需要 CORS,加了反而觸發 preflight 失敗
    a.preload = 'auto'
    a.addEventListener('error', goFallback)
    a.addEventListener('stalled', goFallback)
    a.addEventListener('abort', goFallback)
    // 5 秒沒開始播就 fallback
    const watchdog = setTimeout(() => {
      if (a.readyState < 2) goFallback()
    }, 5000)
    a.addEventListener('playing', () => clearTimeout(watchdog))
    currentAudio = a
    const p = a.play()
    if (p && typeof p.catch === 'function') p.catch(goFallback)
  } catch {
    goFallback()
  }
}

function fallback(text, opts, slow) {
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    // 嘗試挑選英文女聲
    const voices = synth.getVoices()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = opts.lang === 'en' ? 'en-US' : opts.lang || 'en-US'
    u.rate = slow ? 0.55 : 0.95
    const enVoice =
      voices.find((v) => /en[-_]US/i.test(v.lang) && /female|samantha|google|microsoft/i.test(v.name)) ||
      voices.find((v) => /en[-_]US/i.test(v.lang)) ||
      voices.find((v) => /^en/i.test(v.lang))
    if (enVoice) u.voice = enVoice
    synth.speak(u)
  } catch (e) {
    console.warn('speak fallback failed', e)
  }
}

// 觸發 voices 載入(部分瀏覽器需要)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  try { window.speechSynthesis.getVoices() } catch {}
  window.speechSynthesis.onvoiceschanged = () => {
    try { window.speechSynthesis.getVoices() } catch {}
  }
}
