import { locations } from '../data/siteData'

export default function Locations() {
  return (
    <section className="locations-section">
      <div className="section-header">
        <h2>Alege localitatea</h2>
        <p>Vezi cine face troc in apropriere de tine</p>
      </div>
      <div className="locations-grid">
        {locations.map((name) => (
          <a
            key={name}
            href={`#loc-${name.toLowerCase().replace(/\s+/g, '-')}`}
            className="location-card"
          >
            <span className="location-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
            </span>
            <span className="location-name">{name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
