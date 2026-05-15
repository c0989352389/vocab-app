// 用 WebAudio 動態生成音效,不需資源檔
let ctx = null
function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('AudioContext failed', e)
    }
  }
  return ctx
}

function tone({ freq, duration = 0.12, type = 'sine', gain = 0.15, delay = 0 }) {
  const c = getCtx()
  if (!c) return
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + duration)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export const sfx = {
  correct() {
    tone({ freq: 660, duration: 0.1 })
    tone({ freq: 880, duration: 0.14, delay: 0.08 })
  },
  wrong() {
    tone({ freq: 220, duration: 0.18, type: 'square', gain: 0.1 })
  },
  combo() {
    tone({ freq: 880, duration: 0.08 })
    tone({ freq: 1108, duration: 0.08, delay: 0.06 })
    tone({ freq: 1318, duration: 0.14, delay: 0.12 })
  },
  goal() {
    const notes = [523, 659, 784, 1047]
    notes.forEach((f, i) => tone({ freq: f, duration: 0.18, delay: i * 0.1, gain: 0.18 }))
  },
}
