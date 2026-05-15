import { useEffect, useState } from 'react'

// 短暫 flash combo / +gems / milestone 訊息
export default function ComboFlash({ message }) {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    if (!message) return
    setText(message)
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 1200)
    return () => clearTimeout(t)
  }, [message])

  if (!text) return null
  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-duo-gold text-white font-extrabold px-5 py-2 rounded-full shadow-lg text-lg">
        {text}
      </div>
    </div>
  )
}
