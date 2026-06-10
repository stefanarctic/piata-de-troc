const SITE_BASE = import.meta.env.DEV ? '/remote' : 'https://piatadetroc.ro'
const API_BASE = `${SITE_BASE}/wp-json/piata/v1`

const fetchOpts = { credentials: 'include' }

export function slugifyAuthor(name) {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function buildAuthorFromListings(listings, slug) {
  const normalized = slug.toLowerCase()
  const authorListings = listings.filter(
    (item) => slugifyAuthor(item.author) === normalized,
  )

  if (!authorListings.length) return null

  const first = authorListings[0]
  return {
    id: null,
    login: slug,
    slug,
    displayName: first.author,
    email: '',
    avatar: first.authorAvatar || '',
    registered: '',
    memberSince: first.memberSince || '',
    stats: {
      total: authorListings.length,
      active: authorListings.length,
      expired: 0,
      pending: 0,
      private: 0,
    },
    listings: authorListings,
    source: 'static',
  }
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/me`, fetchOpts)
  if (res.status === 401) return null
  if (!res.ok) throw new Error('Nu am putut incarca profilul.')
  return res.json()
}

export async function fetchUserBySlug(slug) {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(slug)}`, fetchOpts)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Nu am putut incarca utilizatorul.')
  return res.json()
}

export async function fetchUserListings(slug, { status } = {}) {
  const params = status && status !== 'all' ? `?status=${status}` : ''
  const res = await fetch(
    `${API_BASE}/users/${encodeURIComponent(slug)}/listings${params}`,
    fetchOpts,
  )
  if (res.status === 404) return []
  if (!res.ok) throw new Error('Nu am putut incarca anunturile utilizatorului.')
  return res.json()
}

export const WP_LOGIN_URL = 'https://piatadetroc.ro/wp-login.php'
export const WP_LOGOUT_URL = 'https://piatadetroc.ro/wp-login.php?action=logout'
export const WP_SUBMIT_URL = 'https://piatadetroc.ro/submit-listing/'
export const WP_ADMIN_URL = 'https://piatadetroc.ro/wp-admin/'
