import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { menus, siteAssets } from '../data/siteData'
import { userAvatarProps } from '../utils/userAvatar'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const location = useLocation()

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
              <img {...userAvatarProps({ avatar: siteAssets.userAvatar })} alt="" />
            </button>
            {userOpen && (
              <div className="user-dropdown">
                <a href="https://piatadetroc.ro/my-dashboard/" target="_blank" rel="noreferrer">
                  My Dashboard
                </a>
                <a href="https://piatadetroc.ro/my-dashboard/" target="_blank" rel="noreferrer">
                  My Listings
                </a>
                <a href="https://piatadetroc.ro/my-dashboard/?directory_action=profile" target="_blank" rel="noreferrer">
                  Edit Profile
                </a>
                <a href="https://piatadetroc.ro/wp-login.php?action=logout" target="_blank" rel="noreferrer">
                  Logout
                </a>
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
