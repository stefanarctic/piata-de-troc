import { useState } from 'react'
import { menus, asset } from '../data/siteData'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

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

        <a href="#acasa" className="logo-link">
          <img src={asset('cropped-1a975cab-6251-4ec6-880c-407c13db1907.jpg')} alt="Piata de troc" className="logo" />
        </a>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {menus.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={item.active ? 'active' : ''}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="header-actions">
          <div className="user-menu">
            <button
              type="button"
              className="user-btn"
              aria-label="Cont utilizator"
              onClick={() => setUserOpen((open) => !open)}
            >
              <img src={asset('38390ac22dc073779f536eb2de19d198.jpg')} alt="" />
            </button>
            {userOpen && (
              <div className="user-dropdown">
                <a href="#dashboard">My Dashboard</a>
                <a href="#listings">My Listings</a>
                <a href="#profile">Edit Profile</a>
                <a href="#logout">Logout</a>
              </div>
            )}
          </div>
          <a href="#publica" className="btn btn-primary publish-btn">
            <span className="publish-text">Publica un anunt</span>
            <span className="publish-icon">+</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
