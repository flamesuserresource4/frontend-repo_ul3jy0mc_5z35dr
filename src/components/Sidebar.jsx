import { Link, useLocation } from 'react-router-dom'

const items = [
  { label: 'Live Control', to: '#' },
  { label: 'Data Display', to: '#' },
  { label: 'Tournaments', to: '/games/PUBG%20Mobile' },
  { label: 'Settings', to: '#' },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  return (
    <aside className="w-56 bg-slate-900/60 border-r border-slate-800 backdrop-blur text-slate-200 p-4 space-y-2">
      <div className="text-xl font-bold mb-4">Esports Admin</div>
      {items.map((it) => (
        <Link
          key={it.label}
          to={it.to}
          className={`block rounded px-3 py-2 hover:bg-slate-800 ${pathname === it.to ? 'bg-slate-800' : ''}`}
        >
          {it.label}
        </Link>
      ))}
    </aside>
  )
}
