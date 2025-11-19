import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const [games, setGames] = useState([])

  useEffect(() => {
    const load = async () => {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/games`)
      const data = await res.json()
      setGames(data)
    }
    load()
  }, [])

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">Esports Tournament Management</h1>
        <div className="grid grid-cols-2 gap-6 place-items-center">
          {games.map((g) => (
            <Link key={g.name} to={`/games/${encodeURIComponent(g.name)}`} className="group">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center shadow hover:shadow-blue-500/30 transition">
                <img src={`/${g.icon}`} alt={g.name} className="w-14 h-14 object-contain" />
              </div>
              <div className="mt-2 text-slate-200 group-hover:text-white">{g.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
