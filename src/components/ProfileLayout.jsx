import { Link, NavLink, Outlet, useSearchParams } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { WP_ADMIN_URL, WP_LOGIN_URL, WP_SUBMIT_URL } from '../services/userApi'
import { userAvatarProps } from '../utils/userAvatar'

const listingFilters = [
  { label: 'Toate', status: 'all' },
  { label: 'Publicate', status: 'publish' },
  { label: 'Private', status: 'private' },
  { label: 'In asteptare', status: 'pending' },
  { label: 'Expirate', status: 'expired' },
]

export default function ProfileLayout() {
  const { user, loading } = useUser()
  const [searchParams] = useSearchParams()
  const listingStatus = searchParams.get('status') || 'all'

  if (loading) {
    return <p className="loading-msg profile-loading">Se incarca contul...</p>
  }

  if (!user) {
    return (
      <div className="profile-login-prompt">
        <h1>Contul meu</h1>
        <p>Trebuie sa fii autentificat pentru a accesa panoul de control.</p>
        <a href={WP_LOGIN_URL} className="btn btn-primary">
          Autentificare
        </a>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-page-inner">
        <aside className="profile-sidebar">
          <div className="profile-user-card">
            <div className="profile-avatar">
              <img {...userAvatarProps({ avatar: user.avatar })} alt="" />
            </div>
            <p className="profile-login">{user.login}</p>
            <h2>{user.displayName}</h2>
            <span className="profile-status online">Online</span>
          </div>

          <nav className="profile-nav">
            <div className="profile-nav-group">
              <span className="profile-nav-label">Anunturi</span>
              <ul>
                {listingFilters.map((item) => (
                  <li key={item.status}>
                    <Link
                      to={`/cont/anunturi${item.status === 'all' ? '' : `?status=${item.status}`}`}
                      className={listingStatus === item.status ? 'active' : ''}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="profile-nav-links">
              <li>
                <NavLink to="/cont" end>
                  Panou de control
                </NavLink>
              </li>
              <li>
                <NavLink to="/cont/profil">Editeaza profilul</NavLink>
              </li>
              <li>
                <a href={WP_SUBMIT_URL} target="_blank" rel="noreferrer">
                  Adauga anunt
                </a>
              </li>
              <li>
                <a href={WP_ADMIN_URL} target="_blank" rel="noreferrer">
                  WP Admin
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="profile-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
