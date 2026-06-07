import { Link } from 'react-router-dom'
import { listingImageProps } from '../utils/listingImage'

export default function ListingCard({ listing, favourites, onToggleFav, showLocation = false }) {
  const imgProps = listingImageProps(listing)
  const isFav = favourites?.has(listing.slug)

  return (
    <article className="listing-card">
      <figure>
        <Link to={`/listings/${listing.slug}`} className="listing-thumb">
          <img
            {...imgProps}
            alt={listing.title}
            loading="lazy"
          />
        </Link>
        <button
          type="button"
          className={`fav-btn ${isFav ? 'active' : ''}`}
          aria-label="Adauga la favorite"
          onClick={() => onToggleFav?.(listing.slug)}
        >
          ♥
        </button>
      </figure>
      <div className="listing-body">
        {listing.category && <span className="listing-cat">{listing.category}</span>}
        <h3>
          <Link to={`/listings/${listing.slug}`}>{listing.title}</Link>
        </h3>
        {showLocation && listing.location && (
          <span className="listing-location">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            </svg>
            {listing.location}
          </span>
        )}
      </div>
    </article>
  )
}
