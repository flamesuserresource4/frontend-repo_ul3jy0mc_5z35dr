import Sidebar from './components/Sidebar'
import Landing from './components/Landing'
import GamePage from './components/GamePage'
import TournamentPage from './components/TournamentPage'
import { Routes, Route } from 'react-router-dom'

function Shell() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex">
      <Sidebar />
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />
        <Routes>
          <Route index element={<Landing />} />
          <Route path="/games/:gameName" element={<GamePage />} />
          <Route path="/t/:id" element={<TournamentPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App(){
  return <Shell />
}
