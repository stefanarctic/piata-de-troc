const LIVE_API = 'https://piatadetroc.ro/wp-json/piata/v1/listings'
const DATA_URL = '/data/listings.json'

let cache = null
let cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000

async function fetchLiveListings() {
  const res = await fetch(LIVE_API)
  if (!res.ok) throw new Error('Live API unavailable')
  const apiItems = await res.json()

  const sitemapRes = await fetch('https://piatadetroc.ro/wp-sitemap-posts-dp_listing-1.xml')
  if (!sitemapRes.ok) throw new Error('Sitemap unavailable')
  const sitemapXml = await sitemapRes.text()
  const slugs = [...sitemapXml.matchAll(/listings\/([^/]+)\//g)].map((m) => m[1])

  const apiByTitle = Object.fromEntries(
    apiItems.map((item) => [item.title.toLowerCase(), item]),
  )

  return slugs.map((slug) => {
    const api = Object.values(apiByTitle).find((item) =>
      slug.replace(/-/g, ' ').includes(item.title.toLowerCase().slice(0, 8)),
    )
    const meta = api?.meta || {}
    const title = api?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

    return {
      id: api?.id || Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)),
      slug,
      title,
      category: '',
      location: meta._address_line_1?.[0] || '',
      image: '',
      images: [],
      date: '',
      views: meta._total_clicks?.[0] || '',
      author: '',
      memberSince: '',
      phone: meta._field_6?.[0] || '',
      email: meta._field_8?.[0] || '',
      description: api?.content ? stripHtml(api.content) : '',
      url: `https://piatadetroc.ro/listings/${slug}/`,
    }
  })
}

function stripHtml(html) {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent?.trim() || ''
}

export async function fetchAllListings({ force = false } = {}) {
  if (!force && cache && Date.now() - cacheTime < CACHE_TTL) {
    return cache
  }

  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      cache = data
      cacheTime = Date.now()
      return data
    }
  } catch {
    /* fall through */
  }

  try {
    const data = await fetchLiveListings()
    cache = data
    cacheTime = Date.now()
    return data
  } catch {
    if (cache) return cache
    throw new Error('Nu am putut incarca anunturile.')
  }
}

export async function fetchListingBySlug(slug) {
  const listings = await fetchAllListings()
  const listing = listings.find((item) => item.slug === slug)
  if (!listing) throw new Error('Anuntul nu a fost gasit.')
  return listing
}

export function getRelatedListings(listing, all, limit = 2) {
  return all
    .filter((item) => item.slug !== listing.slug && item.category === listing.category)
    .slice(0, limit)
}
