import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function TournamentPage() {
  const { id } = useParams()
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [tab, setTab] = useState('teams')
  const [tournament, setTournament] = useState(null)
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])

  const [teamForm, setTeamForm] = useState({ team_name: '', team_logo: '' })
  const [playerForm, setPlayerForm] = useState({ IGN: '', UID: '', player_photo: '', team_id: '' })

  const loadTournament = async () => {
    const res = await fetch(`${baseUrl}/tournaments/${id}`)
    const data = await res.json()
    setTournament(data)
  }
  const loadTeams = async () => {
    const res = await fetch(`${baseUrl}/teams`)
    setTeams(await res.json())
  }
  const loadPlayers = async () => {
    const res = await fetch(`${baseUrl}/players`)
    setPlayers(await res.json())
  }

  useEffect(() => {
    loadTournament(); loadTeams(); loadPlayers()
  }, [id])

  const attachTeam = async (team_id) => {
    await fetch(`${baseUrl}/tournaments/${id}/teams`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ team_id }) })
    await loadTournament()
  }

  const createTeam = async () => {
    if (!teamForm.team_name) return
    await fetch(`${baseUrl}/teams`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(teamForm) })
    setTeamForm({ team_name: '', team_logo: '' })
    await loadTeams()
  }

  const createPlayer = async () => {
    if (!playerForm.IGN || !playerForm.UID) return
    await fetch(`${baseUrl}/players`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(playerForm) })
    setPlayerForm({ IGN: '', UID: '', player_photo: '', team_id: '' })
    await loadPlayers()
  }

  // Brackets
  const [matches, setMatches] = useState([])
  const loadMatches = async () => {
    const res = await fetch(`${baseUrl}/tournaments/${id}/matches`)
    setMatches(await res.json())
  }
  const genBrackets = async () => {
    await fetch(`${baseUrl}/tournaments/${id}/brackets/generate`, { method: 'POST' })
    await loadMatches()
  }

  // Groups
  const [groupInput, setGroupInput] = useState({ number_of_teams: 8, number_of_groups: 2 })
  const [groups, setGroups] = useState([])
  const [standings, setStandings] = useState([])
  const loadGroups = async () => {
    const res = await fetch(`${baseUrl}/tournaments/${id}/groups`)
    setGroups(await res.json())
  }
  const loadStandings = async () => {
    const res = await fetch(`${baseUrl}/tournaments/${id}/standings`)
    setStandings(await res.json())
  }
  const genGroups = async () => {
    await fetch(`${baseUrl}/tournaments/${id}/groups/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(groupInput) })
    await loadGroups(); await loadStandings()
  }

  useEffect(() => { loadMatches(); loadGroups(); loadStandings() }, [id])

  const allTeamsById = useMemo(() => {
    const map = {}
    for (const t of teams) map[t.id] = t
    return map
  }, [teams])

  return (
    <div className="flex-1 p-6 text-slate-200 space-y-6">
      <h2 className="text-2xl font-bold">{tournament?.name}</h2>

      <div className="flex gap-2">
        <button onClick={()=>setTab('teams')} className={`px-3 py-2 rounded ${tab==='teams'?'bg-blue-600':'bg-slate-700'}`}>Teams</button>
        <button onClick={()=>setTab('players')} className={`px-3 py-2 rounded ${tab==='players'?'bg-blue-600':'bg-slate-700'}`}>Players</button>
        <button onClick={()=>setTab('brackets')} className={`px-3 py-2 rounded ${tab==='brackets'?'bg-blue-600':'bg-slate-700'}`}>Brackets</button>
        <button onClick={()=>setTab('groups')} className={`px-3 py-2 rounded ${tab==='groups'?'bg-blue-600':'bg-slate-700'}`}>Group Standings</button>
      </div>

      {tab==='teams' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded p-4 space-y-3">
            <h3 className="font-semibold">Add Team</h3>
            <input value={teamForm.team_name} onChange={e=>setTeamForm(f=>({...f, team_name:e.target.value}))} placeholder="Team name" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
            <input value={teamForm.team_logo} onChange={e=>setTeamForm(f=>({...f, team_logo:e.target.value}))} placeholder="Team logo URL" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
            <button onClick={createTeam} className="px-4 py-2 rounded bg-blue-600">Create Team</button>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded p-4">
            <h3 className="font-semibold mb-2">Attach Existing Team</h3>
            <div className="grid grid-cols-2 gap-2">
              {teams.map(t => (
                <button key={t.id} onClick={()=>attachTeam(t.id)} className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded px-3 py-2 hover:border-blue-500">
                  {t.team_logo && <img src={t.team_logo} alt="logo" className="w-6 h-6 object-cover rounded" />}
                  <span className="truncate">{t.team_name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==='players' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded p-4 space-y-3">
            <h3 className="font-semibold">Add Player</h3>
            <input value={playerForm.IGN} onChange={e=>setPlayerForm(f=>({...f, IGN:e.target.value}))} placeholder="IGN" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
            <input value={playerForm.UID} onChange={e=>setPlayerForm(f=>({...f, UID:e.target.value}))} placeholder="UID" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
            <input value={playerForm.player_photo} onChange={e=>setPlayerForm(f=>({...f, player_photo:e.target.value}))} placeholder="Player photo URL (optional)" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
            <select value={playerForm.team_id} onChange={e=>setPlayerForm(f=>({...f, team_id:e.target.value}))} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700">
              <option value="">Select Team</option>
              {teams.map(t=> <option key={t.id} value={t.id}>{t.team_name}</option>)}
            </select>
            <button onClick={createPlayer} className="px-4 py-2 rounded bg-blue-600">Create Player</button>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded p-4">
            <h3 className="font-semibold mb-2">Players</h3>
            <div className="space-y-2 max-h-80 overflow-auto pr-2">
              {players.map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded px-3 py-2">
                  {p.player_photo && <img src={p.player_photo} className="w-8 h-8 rounded object-cover" />}
                  <div className="flex-1">
                    <div className="font-medium">{p.IGN}</div>
                    <div className="text-xs text-slate-400">UID: {p.UID}</div>
                  </div>
                  {p.team_id && <div className="text-xs text-slate-400">Team: {allTeamsById[p.team_id]?.team_name || '—'}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==='brackets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Brackets</h3>
            <button onClick={genBrackets} className="px-4 py-2 rounded bg-blue-600">Auto-generate</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {matches.map(m => (
              <div key={m.id} className="bg-slate-800 border border-slate-700 rounded p-3">
                <div className="text-xs text-slate-400 mb-2">Round {m.round}</div>
                <div className="space-y-2">
                  <TeamSlot team={allTeamsById[m.team1_id]} />
                  <TeamSlot team={allTeamsById[m.team2_id]} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='groups' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input type="number" value={groupInput.number_of_teams} onChange={e=>setGroupInput(g=>({...g, number_of_teams: parseInt(e.target.value||'0')}))} className="w-36 px-3 py-2 rounded bg-slate-900 border border-slate-700" placeholder="# Teams" />
            <input type="number" value={groupInput.number_of_groups} onChange={e=>setGroupInput(g=>({...g, number_of_groups: parseInt(e.target.value||'0')}))} className="w-36 px-3 py-2 rounded bg-slate-900 border border-slate-700" placeholder="# Groups" />
            <button onClick={genGroups} className="px-4 py-2 rounded bg-blue-600">Auto-generate groups</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {groups.map(g => (
              <div key={g.id} className="bg-slate-800 border border-slate-700 rounded p-3">
                <div className="font-semibold mb-2">Group {g.name}</div>
                <div className="space-y-2">
                  {standings.filter(s=>s.group_name===g.name).map(s => (
                    <EditableStanding key={s.id} standing={s} onUpdated={loadStandings} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TeamSlot({ team }) {
  return (
    <div className="h-12 bg-slate-900 border border-slate-700 rounded flex items-center justify-center gap-2 px-2">
      {team?.team_logo && <img src={team.team_logo} alt="logo" className="w-6 h-6 object-cover rounded" />}
      <div className="text-sm text-center flex-1">{team?.team_name || 'Open slot'}</div>
    </div>
  )
}

function EditableStanding({ standing, onUpdated }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({
    team_country_flag: standing.team_country_flag || '',
    team_logo: standing.team_logo || '',
    team_name: standing.team_name || '',
    total_points: standing.total_points || 0,
  })

  const save = async () => {
    await fetch(`${baseUrl}/standings/${standing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setEdit(false)
    onUpdated && onUpdated()
  }

  if (!edit) {
    return (
      <div className="h-12 bg-slate-900 border border-slate-700 rounded flex items-center gap-2 px-2 justify-between">
        <div className="flex items-center gap-2">
          {standing.team_country_flag && <img src={standing.team_country_flag} className="w-5 h-5 rounded-full object-cover" />}
          {standing.team_logo && <img src={standing.team_logo} className="w-6 h-6 rounded object-cover" />}
          <div className="text-sm">{standing.team_name || 'Open slot'}</div>
        </div>
        <div className="text-sm px-2 py-1 rounded bg-slate-800">{standing.total_points}</div>
        <button onClick={()=>setEdit(true)} className="text-xs text-blue-400">Edit</button>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded p-2 space-y-2">
      <input value={form.team_country_flag} onChange={e=>setForm(f=>({...f, team_country_flag:e.target.value}))} placeholder="Country flag URL" className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800" />
      <input value={form.team_logo} onChange={e=>setForm(f=>({...f, team_logo:e.target.value}))} placeholder="Team logo URL" className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800" />
      <input value={form.team_name} onChange={e=>setForm(f=>({...f, team_name:e.target.value}))} placeholder="Team name" className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800" />
      <input type="number" value={form.total_points} onChange={e=>setForm(f=>({...f, total_points: parseInt(e.target.value||'0')}))} placeholder="Total points" className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800" />
      <div className="flex justify-end gap-2">
        <button onClick={()=>setEdit(false)} className="px-3 py-1 rounded bg-slate-700">Cancel</button>
        <button onClick={save} className="px-3 py-1 rounded bg-blue-600">Save</button>
      </div>
    </div>
  )
}
