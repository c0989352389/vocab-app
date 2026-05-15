import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '首頁', icon: '🏠' },
  { to: '/learn', label: '學習', icon: '📚' },
  { to: '/library', label: '單字庫', icon: '🗂️' },
  { to: '/stats', label: '統計', icon: '📊' },
  { to: '/settings', label: '設定', icon: '⚙️' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t-2 border-gray-100">
      <div className="max-w-2xl mx-auto grid grid-cols-5">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 text-xs font-bold transition ${
                isActive ? 'text-duo-green' : 'text-duo-gray'
              }`
            }
          >
            <span className="text-2xl leading-none">{t.icon}</span>
            <span className="mt-1">{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
