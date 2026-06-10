import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useListings } from '../context/ListingsContext'
import ListingsGrid from '../components/ListingsGrid'
import {
  buildAuthorFromListings,
  fetchUserBySlug,
  fetchUserListings,
  slugifyAuthor,
} from '../services/userApi'
import { userAvatarProps } from '../utils/userAvatar'

export default function AuthorProfilePage() {
  const { slug } = useParams()
  const { listings: allListings, loading: listingsLoading } = useListings()
  const [profile, setProfile] = useState(null)
  const [authorListings, setAuthorListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const staticFallback = useMemo(
    () => buildAuthorFromListings(allListings, slug),
    [allListings, slug],
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    async function load() {
      try {
        const [userData, userListings] = await Promise.all([
          fetchUserBySlug(slug),
          fetchUserListings(slug),
        ])

        if (cancelled) return

        if (userData) {
          setProfile(userData)
          setAuthorListings(userListings)
        } else if (staticFallback) {
          setProfile(staticFallback)
          setAuthorListings(staticFallback.listings)
        } else {
          setProfile(null)
          setAuthorListings([])
        }
      } catch (err) {
        if (!cancelled) {
          if (staticFallback) {
            setProfile(staticFallback)
            setAuthorListings(staticFallback.listings)
          } else {
            setError(err.message)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [slug, staticFallback])

  if (loading || listingsLoading) {
    return <p className="loading-msg">Se incarca profilul...</p>
  }

  if (error || !profile) {
    return (
      <div className="profile-not-found">
        <h1>Utilizatorul nu a fost gasit</h1>
        <Link to="/anunturi" className="btn btn-primary">
          Inapoi la anunturi
        </Link>
      </div>
    )
  }

  return (
    <div className="author-profile-page">
      <div className="author-profile-header">
        <div className="author-profile-avatar">
          <img {...userAvatarProps({ avatar: profile.avatar })} alt="" />
        </div>
        <div>
          <h1>{profile.displayName}</h1>
          {profile.memberSince && <p className="member-since">{profile.memberSince}</p>}
          <p className="author-profile-stats">
            {profile.stats?.total ?? authorListings.length} anunturi
          </p>
        </div>
      </div>

      <section>
        <h2>Anunturi publicate</h2>
        {authorListings.length > 0 ? (
          <ListingsGrid listings={authorListings} />
        ) : (
          <p className="profile-empty">Acest utilizator nu are anunturi publicate.</p>
        )}
      </section>
    </div>
  )
}
