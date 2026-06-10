import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { fetchUserListings } from '../services/userApi'
import { listingImageProps } from '../utils/listingImage'

const statusLabels = {
  publish: 'Publicat',
  pending: 'In asteptare',
  private: 'Privat',
  expired: 'Expirat',
  draft: 'Ciorna',
}

export default function ProfileListingsPage() {
  const { user } = useUser()
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') || 'all'
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.slug) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchUserListings(user.slug, { status })
      .then((data) => {
        if (!cancelled) setListings(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user?.slug, status])

  if (loading) {
    return <p className="loading-msg">Se incarca anunturile...</p>
  }

  if (error) {
    return <p className="error-msg">{error}</p>
  }

  return (
    <div className="profile-listings">
      <h1>Anunturile mele</h1>

      {listings.length === 0 ? (
        <p className="profile-empty">Nu ai anunturi in aceasta categorie.</p>
      ) : (
        <div className="profile-listings-table">
          {listings.map((listing) => (
            <article key={listing.id} className="profile-listing-row">
              <Link to={`/listings/${listing.slug}`} className="profile-listing-thumb">
                <img {...listingImageProps(listing)} alt="" />
              </Link>
              <div className="profile-listing-info">
                <h3>
                  <Link to={`/listings/${listing.slug}`}>{listing.title}</Link>
                </h3>
                <span className={`profile-listing-status status-${listing.status}`}>
                  {statusLabels[listing.status] || listing.status}
                </span>
                {listing.views && <span className="profile-listing-views">{listing.views} views</span>}
              </div>
              <a
                href={listing.url}
                className="btn btn-secondary btn-sm"
                target="_blank"
                rel="noreferrer"
              >
                Editeaza
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
