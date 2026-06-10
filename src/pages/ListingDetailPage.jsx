import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useListings } from '../context/ListingsContext'
import { getRelatedListings } from '../services/listingsApi'
import CategoriesWidget from '../components/CategoriesWidget'
import ImageLightbox from '../components/ImageLightbox'
import ListingCard from '../components/ListingCard'
import { isValidImageUrl, listingImageProps } from '../utils/listingImage'
import { userAvatarProps } from '../utils/userAvatar'

export default function ListingDetailPage() {
  const { slug } = useParams()
  const { listings, loading } = useListings()
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const listing = useMemo(
    () => listings.find((item) => item.slug === slug),
    [listings, slug],
  )

  const related = useMemo(
    () => (listing ? getRelatedListings(listing, listings) : []),
    [listing, listings],
  )

  const images = useMemo(() => {
    if (!listing) return []
    const gallery = [...(listing.images || []), listing.image].filter(isValidImageUrl)
    return [...new Set(gallery)]
  }, [listing])

  useEffect(() => {
    setActiveImage(0)
    setLightboxOpen(false)
  }, [slug])

  if (loading) {
    return <p className="loading-msg detail-loading">Se incarca anuntul...</p>
  }

  if (!listing) {
    return (
      <div className="detail-not-found">
        <h1>Anuntul nu a fost gasit</h1>
        <Link to="/anunturi" className="btn btn-primary">
          Inapoi la anunturi
        </Link>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <div className="detail-page-inner">
        <div className="detail-main">
          <div className="detail-card">
            <div className="detail-meta">
              {listing.date && <span>{listing.date}</span>}
              {listing.views && <span>{listing.views} views</span>}
            </div>

            <h1>{listing.title}</h1>

            <div className="detail-actions">
              <button type="button">Report</button>
              <button type="button">Download</button>
              <button type="button">Print</button>
              <button type="button">Bookmark</button>
              <button type="button">Share</button>
            </div>

            <div className="detail-gallery">
              <button
                type="button"
                className="detail-gallery-main"
                onClick={() => setLightboxOpen(true)}
                aria-label="Deschide imaginea marita"
              >
                <img
                  {...listingImageProps({ image: images[activeImage], images })}
                  alt={listing.title}
                />
              </button>
              {images.length > 1 && (
                <div className="detail-gallery-thumbs">
                  {images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      className={i === activeImage ? 'active' : ''}
                      onClick={() => setActiveImage(i)}
                    >
                      <img {...listingImageProps({ image: img })} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <section className="detail-section">
              <h2>Descriere:</h2>
              <p>{listing.description || 'Nu exista descriere pentru acest anunt.'}</p>
            </section>

            <section className="detail-section">
              <h2>Contact Information</h2>
              <dl className="contact-info">
                {listing.category && (
                  <>
                    <dt>Categorie</dt>
                    <dd>{listing.category}</dd>
                  </>
                )}
                {listing.phone && (
                  <>
                    <dt>Telefon</dt>
                    <dd>{listing.phone}</dd>
                  </>
                )}
                {listing.location && (
                  <>
                    <dt>Adresa</dt>
                    <dd>{listing.location}</dd>
                  </>
                )}
                {listing.email && (
                  <>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${listing.email}`}>{listing.email}</a>
                    </dd>
                  </>
                )}
              </dl>
            </section>

            <section className="detail-section review-section">
              <h2>Post New Review.</h2>
              <p className="review-note">Trebuie sa fii autentificat pentru a posta o recenzie.</p>
              <div className="star-rating" aria-label="Rating 4.5 din 5">
                ★★★★½
              </div>
              <input type="text" placeholder="Review Title" className="detail-input" />
              <textarea placeholder="Review" rows={4} className="detail-input" />
              <button type="button" className="btn btn-success">
                Submit Review
              </button>
            </section>

            {related.length > 0 && (
              <section className="detail-section">
                <h2>Related Listings</h2>
                <div className="related-listings">
                  {related.map((item) => (
                    <ListingCard key={item.slug} listing={item} showLocation />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <aside className="detail-sidebar">
          <div className="author-widget detail-card">
            <div className="author-avatar">
              <img {...userAvatarProps(listing)} alt="" />
              <span className="offline-badge">Offline</span>
            </div>
            <h3>{listing.author || 'Utilizator'}</h3>
            {listing.memberSince && <p className="member-since">{listing.memberSince}</p>}
            <Link to="/anunturi" className="view-ads-link">
              View All Ads
            </Link>
            <div className="author-btns">
              <button type="button" className="btn btn-secondary">
                Send Message
              </button>
              <button type="button" className="btn btn-secondary">
                Send Offer
              </button>
            </div>
            {listing.email && (
              <a href={`mailto:${listing.email}`} className="btn btn-email">
                ✉ Send Email
              </a>
            )}
          </div>

          <CategoriesWidget />
        </aside>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          activeIndex={activeImage}
          alt={listing.title}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setActiveImage}
        />
      )}
    </div>
  )
}
