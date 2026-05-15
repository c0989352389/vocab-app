import { useState, useEffect, useRef } from 'react'
import { speak } from '../../utils/speak'
import { usePhonetic } from '../../utils/phonetic'
import Phonetic from '../Phonetic'

// 聽寫:播放發音,使用者輸入英文,送出後比對
export default function ListenType({ word, onAnswer }) {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('typing') // typing | correct | wrong
  const inputRef = useRef(null)
  const phonetic = usePhonetic(word.en)

  useEffect(() => {
    setInput('')
    setStatus('typing')
    const t = setTimeout(() => {
      speak(word.en)
      inputRef.current?.focus()
    }, 200)
    return () => clearTimeout(t)
  }, [word.id])

  function submit() {
    if (status !== 'typing') return
    const ans = input.trim().toLowerCase()
    const target = word.en.trim().toLowerCase()
    const correct = ans === target
    setStatus(correct ? 'correct' : 'wrong')
  }

  function next() {
    onAnswer(status === 'correct')
  }

  const bg =
    status === 'correct'
      ? 'bg-duo-green/10 border-duo-green'
      : status === 'wrong'
      ? 'bg-duo-red/10 border-duo-red'
      : 'bg-white border-gray-200'

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-sm text-duo-gray font-bold">聽發音輸入英文</div>

      <button
        onClick={() => speak(word.en)}
        className="w-32 h-32 rounded-full bg-duo-blue text-white text-6xl shadow-duo active:translate-y-1 active:shadow-none flex items-center justify-center"
        aria-label="再聽一次"
      >
        🔊
      </button>

      <div className="text-center text-duo-gray text-sm">{word.zh}</div>

      <div className={`w-full card-duo ${bg} transition`}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (status === 'typing') submit()
              else next()
            }
          }}
          disabled={status !== 'typing'}
          placeholder="輸入英文..."
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full text-center text-xl font-bold outline-none bg-transparent py-2"
        />
        {status === 'wrong' && (
          <div className="text-center mt-2">
            <div className="text-sm">
              <span className="text-duo-red">✗ 正確答案：</span>
              <span className="font-extrabold text-duo-greenDark">{word.en}</span>
            </div>
            <Phonetic data={phonetic} size="sm" className="mt-1" />
          </div>
        )}
        {status === 'correct' && (
          <div className="text-center text-duo-greenDark font-bold mt-2">
            ✓ 答對了！
          </div>
        )}
      </div>

      {status === 'typing' ? (
        <button onClick={submit} disabled={!input.trim()} className="btn-primary w-full disabled:opacity-50">
          送出
        </button>
      ) : (
        <button onClick={next} className="btn-primary w-full">
          繼續 →
        </button>
      )}
    </div>
  )
}
