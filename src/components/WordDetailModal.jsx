import { TAG_LABELS } from '../data/words'
import { speak } from '../utils/speak'
import { useStore } from '../store/useStore'
import { LEVEL_META } from '../utils/srs'
import { usePhonetic } from '../utils/phonetic'
import Phonetic from './Phonetic'

export default function WordDetailModal({ word, onClose }) {
  const progress = useStore((s) => (word ? s.progress[word.id] : null))
  const phonetic = usePhonetic(word?.en)
  if (!word) return null

  const level = progress?.level || 0
  const meta = LEVEL_META[level]
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-duo p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold">{word.en}</h2>
              <button
                onClick={() => speak(word.en)}
                className="text-2xl hover:scale-110 transition"
                aria-label="發音"
              >
                🔊
              </button>
            </div>
            <Phonetic data={phonetic} size="md" className="!justify-start mt-1" />
            <p className="text-duo-gray text-sm mt-1">{word.pos}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-duo-gray hover:text-duo-ink"
            aria-label="關閉"
          >
            ✕
          </button>
        </div>

        <div className="text-xl font-bold text-duo-greenDark mb-4">{word.zh}</div>

        <div className="bg-duo-bg rounded-duo p-3 mb-3">
          <div className="text-sm text-duo-gray mb-1">例句</div>
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold">{word.example}</p>
            <button
              onClick={() => speak(word.example)}
              className="text-xl shrink-0"
              aria-label="例句發音"
            >
              🔊
            </button>
          </div>
          <p className="text-sm text-duo-gray mt-1">{word.exampleZh}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-duo-bg border border-gray-200 rounded-full px-3 py-1 font-bold">
            {meta.emoji} {meta.name}
          </span>
          {word.tags?.map((t) => (
            <span
              key={t}
              className="text-xs bg-duo-bg border border-gray-200 rounded-full px-3 py-1 font-bold"
            >
              {TAG_LABELS[t] || t}
            </span>
          ))}
        </div>

        {progress && (
          <div className="text-xs text-duo-gray text-center">
            複習 {progress.reviewCount} 次 · 答對 {progress.correctCount} 次
          </div>
        )}
      </div>
    </div>
  )
}
