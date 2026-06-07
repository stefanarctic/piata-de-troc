import { useMemo, useState } from 'react'
import { asset } from '../data/siteData'

const PAGE_SIZE = 8

export default function ListingsGrid({ listings, searchQuery, selectedCategory }) {
  const [favourites, setFavourites] = useState(new Set())
  const filterKey = `${searchQuery}|${selectedCategory}`

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return listings.filter((item) => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      return matchesCategory && matchesQuery
    })
  }, [listings, searchQuery, selectedCategory])

  const toggleFavourite = (id) => {
    setFavourites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section id="anunturi" className="listings-section">
      <div className="section-header">
        <h2>Ultimele anunturi</h2>
        <p>Vrei sa faci troc? Alege anuntul care ti se potriveste.</p>
      </div>

      <ListingsContent
        key={filterKey}
        filtered={filtered}
        favourites={favourites}
        toggleFavourite={toggleFavourite}
      />
    </section>
  )
}

function ListingsContent({ filtered, favourites, toggleFavourite }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  if (filtered.length === 0) {
    return <p className="no-results">Nu am gasit anunturi pentru criteriile selectate.</p>
  }

  return (
    <>
      <div className="listings-grid">
        {visible.map((listing) => (
          <article key={listing.id} className="listing-card">
            <figure>
              <a href={`#listing-${listing.id}`} className="listing-thumb">
                <img src={asset(listing.image)} alt={listing.title} loading="lazy" />
              </a>
              <button
                type="button"
                className={`fav-btn ${favourites.has(listing.id) ? 'active' : ''}`}
                aria-label="Adauga la favorite"
                onClick={() => toggleFavourite(listing.id)}
              >
                ♥
              </button>
            </figure>
            <div className="listing-body">
              <h3>
                <a href={`#listing-${listing.id}`}>{listing.title}</a>
              </h3>
              {listing.category && (
                <span className="listing-cat">{listing.category}</span>
              )}
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          className="btn btn-primary load-more"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >
          Load More
        </button>
      )}
    </>
  )
}
