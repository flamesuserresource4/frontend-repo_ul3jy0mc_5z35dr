import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function GamePage() {
  const { gameName } = useParams()
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [tournaments, setTournaments] = useState([])
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  const load = async () => {
    const res = await fetch(`${baseUrl}/tournaments?game=${encodeURIComponent(gameName)}`)
    const data = await res.json()
    setTournaments(data)
  }

  useEffect(() => { load() }, [gameName])

  const create = async () => {
    if (!name.trim()) return
    setCreating(true)
    try {
      await fetch(`${baseUrl}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournament_name: name, game: gameName })
      })
      setName('')
      await load()
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex-1 p-6 text-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{gameName} Tournaments</h2>
        <div className="flex gap-2">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tournament name" className="px-3 py-2 rounded bg-slate-800 border border-slate-700" />
          <button onClick={create} disabled={creating} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50">Create New</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.map(t => (
          <Link key={t.id} to={`/t/${t.id}`} className="block rounded-xl bg-slate-800 border border-slate-700 p-4 hover:border-blue-500">
            <div className="text-lg font-semibold">{t.name}</div>
            <div className="text-slate-400">Teams: {t.team_ids?.length || 0}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
