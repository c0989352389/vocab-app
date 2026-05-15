import { useState, useEffect } from 'react'
import { speak } from '../../utils/speak'
import { usePhonetic } from '../../utils/phonetic'
import Phonetic from '../Phonetic'

// 翻卡:正面英文 + 發音 + 例句,使用者判斷自己是否認識,按「我知道」/「不認識」
export default function FlipCard({ word, onAnswer }) {
  const [flipped, setFlipped] = useState(false)
  const phonetic = usePhonetic(word.en)

  useEffect(() => {
    setFlipped(false)
    // 進場自動唸一次
    const t = setTimeout(() => speak(word.en), 200)
    return () => clearTimeout(t)
  }, [word.id])

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm text-duo-gray font-bold">點卡片看答案</div>

      <button
        onClick={() => setFlipped(true)}
        className="w-full min-h-[260px] card-duo flex flex-col items-center justify-center gap-3 text-center p-6"
      >
        {!flipped ? (
          <>
            <div className="text-4xl font-extrabold">{word.en}</div>
            <Phonetic data={phonetic} size="lg" />
            <div className="text-sm text-duo-gray">{word.pos}</div>
            <button
              onClick={(e) => { e.stopPropagation(); speak(word.en) }}
              className="text-3xl mt-2"
              aria-label="發音"
            >
              🔊
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-extrabold">{word.en}</div>
              <button
                onClick={(e) => { e.stopPropagation(); speak(word.en) }}
                className="text-2xl"
                aria-label="發音"
              >
                🔊
              </button>
            </div>
            <Phonetic data={phonetic} size="lg" />
            <div className="text-2xl font-extrabold text-duo-greenDark mt-1">
              {word.zh}
            </div>
            <div className="text-sm text-duo-gray">{word.pos}</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="text-base font-semibold">{word.example}</div>
              <button
                onClick={(e) => { e.stopPropagation(); speak(word.example) }}
                className="text-xl shrink-0"
                aria-label="例句發音"
              >
                🔊
              </button>
            </div>
            <div className="text-sm text-duo-gray">{word.exampleZh}</div>
          </>
        )}
      </button>

      {flipped ? (
        <div className="w-full grid grid-cols-2 gap-3">
          <button
            onClick={() => onAnswer(false)}
            className="btn-duo bg-white text-duo-red border-2 border-duo-red shadow-duo active:shadow-none"
          >
            ❌ 不認識
          </button>
          <button
            onClick={() => onAnswer(true)}
            className="btn-primary"
          >
            ✅ 我知道
          </button>
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="btn-secondary w-full"
        >
          翻面看答案
        </button>
      )}
    </div>
  )
}
