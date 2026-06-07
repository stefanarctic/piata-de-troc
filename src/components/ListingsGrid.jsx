import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingCard from './ListingCard'

const PAGE_SIZE = 8

export default function ListingsGrid({
  listings,
  loading,
  searchQuery,
  selectedCategory,
  title = 'Ultimele anunturi',
  subtitle = 'Vrei sa faci troc? Alege anuntul care ti se potriveste.',
}) {
  const navigate = useNavigate()
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

  const toggleFavourite = (slug) => {
    setFavourites((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const handleSearchNavigate = () => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (selectedCategory) params.set('category', selectedCategory)
    navigate(`/anunturi?${params.toString()}`)
  }

  return (
    <section id="anunturi" className="listings-section">
      <div className="section-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {loading ? (
        <p className="loading-msg">Se incarca anunturile...</p>
      ) : (
        <ListingsContent
          key={filterKey}
          filtered={filtered}
          favourites={favourites}
          toggleFavourite={toggleFavourite}
          onViewAll={handleSearchNavigate}
        />
      )}
    </section>
  )
}

function ListingsContent({ filtered, favourites, toggleFavourite, onViewAll }) {
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
          <ListingCard
            key={listing.slug}
            listing={listing}
            favourites={favourites}
            onToggleFav={toggleFavourite}
          />
        ))}
      </div>

      {hasMore ? (
        <button
          type="button"
          className="btn btn-primary load-more"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >
          Load More
        </button>
      ) : (
        <button type="button" className="btn btn-primary load-more" onClick={onViewAll}>
          Vezi toate anunturile
        </button>
      )}
    </>
  )
}
