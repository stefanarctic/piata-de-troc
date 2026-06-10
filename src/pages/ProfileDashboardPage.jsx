import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const statCards = [
  { key: 'total', label: 'Total anunturi', color: 'blue', icon: '▤', to: '/cont/anunturi' },
  { key: 'active', label: 'Anunturi active', color: 'green', icon: '✓', to: '/cont/anunturi?status=publish' },
  { key: 'expired', label: 'Anunturi expirate', color: 'red', icon: '!', to: '/cont/anunturi?status=expired' },
  { key: 'pending', label: 'In asteptare', color: 'orange', icon: '◷', to: '/cont/anunturi?status=pending' },
]

export default function ProfileDashboardPage() {
  const { user } = useUser()
  const stats = user?.stats || {}

  return (
    <div className="profile-dashboard">
      <h1>Panou de control</h1>
      <div className="profile-stats">
        {statCards.map((card) => (
          <Link key={card.key} to={card.to} className={`profile-stat-card ${card.color}`}>
            <span className="profile-stat-icon" aria-hidden="true">
              {card.icon}
            </span>
            <div>
              <strong>{stats[card.key] ?? 0}</strong>
              <span>{card.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
