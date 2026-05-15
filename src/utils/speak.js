// iOS 對音訊政策嚴格: Google TTS 非同步失敗 → fallback 已不在 user gesture → SpeechSynthesis 被擋
// 所以 iOS 直接走 SpeechSynthesis (同步在 click handler 內呼叫)
const IS_IOS =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ 偽裝成 desktop Safari
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

let currentAudio = null
const lastPlay = new Map()

export function speak(text, opts = {}) {
  if (!text || typeof window === 'undefined') return

  try { currentAudio?.pause(); window.speechSynthesis?.cancel() } catch {}

  const key = text.toLowerCase().trim()
  const now = Date.now()
  const prev = lastPlay.get(key) || 0
  const isRepeat = now - prev < 4000
  lastPlay.set(key, now)

  // iOS: 直接同步呼叫 SpeechSynthesis,不繞 Google TTS
  if (IS_IOS) {
    speakNative(text, opts, isRepeat)
    return
  }

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
    speakNative(text, opts, isRepeat)
  }

  try {
    const a = new Audio()
    a.src = url
    a.preload = 'auto'
    a.addEventListener('error', goFallback)
    a.addEventListener('stalled', goFallback)
    a.addEventListener('abort', goFallback)
    const watchdog = setTimeout(() => {
      if (a.readyState < 2) goFallback()
    }, 4000)
    a.addEventListener('playing', () => clearTimeout(watchdog))
    currentAudio = a
    const p = a.play()
    if (p && typeof p.catch === 'function') p.catch(goFallback)
  } catch {
    goFallback()
  }
}

function speakNative(text, opts, slow) {
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    // iOS 有時要先 cancel 才會真的播
    synth.cancel()
    const voices = synth.getVoices()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = opts.lang === 'en' ? 'en-US' : opts.lang || 'en-US'
    u.rate = slow ? 0.55 : 0.95
    u.pitch = 1
    u.volume = 1
    const enVoice =
      voices.find((v) => /en[-_]US/i.test(v.lang) && /samantha|alex|female|google|microsoft/i.test(v.name)) ||
      voices.find((v) => /en[-_]US/i.test(v.lang)) ||
      voices.find((v) => /^en/i.test(v.lang))
    if (enVoice) u.voice = enVoice
    synth.speak(u)
  } catch (e) {
    console.warn('speakNative failed', e)
  }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  try { window.speechSynthesis.getVoices() } catch {}
  window.speechSynthesis.onvoiceschanged = () => {
    try { window.speechSynthesis.getVoices() } catch {}
  }
}
