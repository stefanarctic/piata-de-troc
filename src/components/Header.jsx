import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { menus, siteAssets } from '../data/siteData'
import { WP_LOGOUT_URL } from '../services/userApi'
import { userAvatarProps } from '../utils/userAvatar'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const location = useLocation()
  const { user } = useUser()
  const avatar = user?.avatar || siteAssets.userAvatar

  return (
    <header className="site-header">
      <nav className="site-nav">
        <button
          type="button"
          className="burger"
          aria-label="Meniu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
          <img src={siteAssets.logo} alt="Piata de troc" className="logo" />
        </Link>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {menus.map((item) => {
            const isActive =
              item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href)
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={isActive ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="header-actions">
          <div className="user-menu">
            <button
              type="button"
              className="user-btn"
              aria-label="Cont utilizator"
              onClick={() => setUserOpen((open) => !open)}
            >
              <img {...userAvatarProps({ avatar })} alt="" />
            </button>
            {userOpen && (
              <div className="user-dropdown">
                <Link to="/cont" onClick={() => setUserOpen(false)}>
                  Panou de control
                </Link>
                <Link to="/cont/anunturi" onClick={() => setUserOpen(false)}>
                  Anunturile mele
                </Link>
                <Link to="/cont/profil" onClick={() => setUserOpen(false)}>
                  Editeaza profilul
                </Link>
                <a href={WP_LOGOUT_URL}>Deconectare</a>
              </div>
            )}
          </div>
          <a
            href="https://piatadetroc.ro/submit-listing/"
            className="btn btn-primary publish-btn"
            target="_blank"
            rel="noreferrer"
          >
            <span className="publish-text">Publica un anunt</span>
            <span className="publish-icon">+</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
