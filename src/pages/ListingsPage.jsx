import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListingsSidebar from '../components/ListingsSidebar'
import ListingCard from '../components/ListingCard'
import { useListings } from '../context/ListingsContext'

const PAGE_SIZE = 12

export default function ListingsPage() {
  const { listings, loading } = useListings()
  const [searchParams] = useSearchParams()
  const [favourites, setFavourites] = useState(new Set())
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState('grid')

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = listings.filter((item) => {
      const matchQ =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      const matchCat = !category || item.category === category
      const matchLoc = !location || item.location.toLowerCase().includes(location.toLowerCase())
      return matchQ && matchCat && matchLoc
    })

    if (sortBy === 'title') {
      return [...result].sort((a, b) => a.title.localeCompare(b.title))
    }
    return result
  }, [listings, query, category, location, sortBy])

  const visible = filtered.slice(0, visibleCount)

  const toggleFav = (slug) => {
    setFavourites((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  return (
    <div className="listings-page">
      <div className="listings-page-inner">
        <ListingsSidebar />

        <div className="listings-main">
          <div className="listings-toolbar">
            <span className="results-count">
              Result Found <strong>{filtered.length}</strong>
            </span>
            <div className="toolbar-actions">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sorteaza">
                <option value="date">Sort By Date</option>
                <option value="title">Sort By Title</option>
              </select>
              <div className="view-toggle">
                <button
                  type="button"
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                  aria-label="Vizualizare grid"
                >
                  ⊞
                </button>
                <button
                  type="button"
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                  aria-label="Vizualizare lista"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="loading-msg">Se incarca anunturile...</p>
          ) : filtered.length === 0 ? (
            <p className="no-results">Nu am gasit anunturi pentru criteriile selectate.</p>
          ) : (
            <>
              <div className={`listings-grid listings-grid-page ${viewMode === 'list' ? 'list-view' : ''}`}>
                {visible.map((listing) => (
                  <ListingCard
                    key={listing.slug}
                    listing={listing}
                    favourites={favourites}
                    onToggleFav={toggleFav}
                    showLocation
                  />
                ))}
              </div>

              {visibleCount < filtered.length && (
                <button
                  type="button"
                  className="btn btn-primary load-more"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                >
                  Incarca mai multe
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
