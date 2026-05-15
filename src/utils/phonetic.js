import { useEffect, useState } from 'react'

const CACHE_KEY = 'vocab-app-phonetic-v2'
let cache = null

function loadCache() {
  if (cache) return cache
  try {
    cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  } catch {
    cache = {}
  }
  return cache
}

function saveCache() {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch {}
}

const inflight = new Map()

// 確保前後有斜線 /.../  (像 Google)
function normalize(ipa) {
  if (!ipa) return ''
  let s = ipa.trim()
  if (!s) return ''
  if (!s.startsWith('/')) s = '/' + s
  if (!s.endsWith('/')) s = s + '/'
  return s
}

async function fetchPhonetic(word) {
  const key = word.toLowerCase()
  const c = loadCache()
  if (key in c) return c[key]
  if (inflight.has(key)) return inflight.get(key)

  const p = (async () => {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`)
      if (!res.ok) {
        c[key] = { us: '', uk: '', ipa: '' }
        saveCache()
        return c[key]
      }
      const data = await res.json()
      const entry = Array.isArray(data) ? data[0] : null
      const phonetics = entry?.phonetics || []
      // 從 audio URL 線索找 us / uk 對應的 text
      let us = '', uk = ''
      for (const p of phonetics) {
        if (!p.text) continue
        const url = (p.audio || '').toLowerCase()
        if (!us && url.includes('-us.')) us = p.text
        if (!uk && url.includes('-uk.')) uk = p.text
      }
      const fallback = entry?.phonetic || phonetics.find((p) => p.text)?.text || ''
      const result = {
        us: normalize(us || fallback),
        uk: normalize(uk),
        ipa: normalize(fallback),
      }
      c[key] = result
      saveCache()
      return result
    } catch {
      c[key] = { us: '', uk: '', ipa: '' }
      saveCache()
      return c[key]
    } finally {
      inflight.delete(key)
    }
  })()
  inflight.set(key, p)
  return p
}

export function usePhonetic(word) {
  const [data, setData] = useState(() => {
    if (!word) return { us: '', uk: '', ipa: '' }
    const c = loadCache()
    return c[word.toLowerCase()] || { us: '', uk: '', ipa: '' }
  })

  useEffect(() => {
    if (!word) return
    let cancelled = false
    const c = loadCache()
    const key = word.toLowerCase()
    if (key in c) {
      setData(c[key])
      return
    }
    setData({ us: '', uk: '', ipa: '' })
    fetchPhonetic(word).then((d) => { if (!cancelled) setData(d) })
    return () => { cancelled = true }
  }, [word])

  return data
}
