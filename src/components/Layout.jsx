import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto bg-duo-bg">
      <TopBar />
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
