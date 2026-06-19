const SITE_BASE = import.meta.env.DEV ? '/remote' : 'https://piatadetroc.ro'
const LIVE_API = `${SITE_BASE}/wp-json/piata/v1/listings`
const DATA_URL = '/data/listings.json'

let cache = null
let cacheTime = 0
let latestCache = null
let latestCacheTime = 0
const CACHE_TTL = 5 * 60 * 1000

function sanitizeLabel(value) {
  if (!value || typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 80) return ''
  if (/[{]|!important|directorypress-|sourceURL|\.single-listing/i.test(trimmed)) return ''
  return trimmed
}

function sanitizeListing(listing) {
  return {
    ...listing,
    category: sanitizeLabel(listing.category),
    location: sanitizeLabel(listing.location),
  }
}

function stripHtml(html) {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent?.trim() || ''
}

function getOrderDate(item) {
  const raw = item?.meta?._order_date
  const value = Array.isArray(raw) ? raw[raw.length - 1] : raw
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractImageFromContent(content) {
  if (!content) return ''
  const match = content.match(/src="(https:\/\/piatadetroc\.ro\/[^"]+)"/i)
  return match?.[1] || ''
}

function parseHomepageCards(html) {
  const cards = []
  const articlePattern =
    /<article[^>]*class="[^"]*directorypress-listing[^"]*"[^>]*>[\s\S]*?<\/article>/gi
  let match = articlePattern.exec(html)
  while (match) {
    const art = match[0]
    const linkMatch = art.match(/href="https:\/\/piatadetroc\.ro\/listings\/([^/]+)\/"/i)
    if (!linkMatch) {
      match = articlePattern.exec(html)
      continue
    }
    const slug = linkMatch[1]
    const titleMatch = art.match(/alt="([^"]+)"/i)
    const imgMatch =
      art.match(/data-lazy="(https:\/\/piatadetroc\.ro\/[^"]+)"/i) ||
      art.match(/data-src="(https:\/\/piatadetroc\.ro\/[^"]+)"/i) ||
      art.match(/src="(https:\/\/piatadetroc\.ro\/[^"]+)"/i)
    const catMatch = art.match(/<[^>]+class="listing-cat"[^>]*>([^<]+)/i)
    const locMatch = art.match(/<[^>]+class="listing-location"[^>]*>([^<]+)/i)
    cards.push({
      slug,
      title: titleMatch?.[1] || slug,
      image: imgMatch?.[1] || '',
      category: sanitizeLabel(catMatch?.[1]),
      location: sanitizeLabel(locMatch?.[1]),
    })
    match = articlePattern.exec(html)
  }
  return cards
}

function mapApiItemToListing(item, { staticById, staticByTitle, homeByTitle, homeBySlug }) {
  const meta = item.meta || {}
  const staticItem =
    staticById.get(item.id) || staticByTitle.get(item.title.toLowerCase())
  const homeItem = homeByTitle.get(item.title.toLowerCase())
  const slug = staticItem?.slug || homeItem?.slug || slugify(item.title)
  const homeCard = homeItem || homeBySlug.get(slug)
  const image =
    staticItem?.image ||
    homeCard?.image ||
    extractImageFromContent(item.content) ||
    ''

  return {
    id: item.id,
    slug,
    title: item.title,
    category: sanitizeLabel(homeCard?.category) || sanitizeLabel(staticItem?.category) || '',
    location:
      sanitizeLabel(homeCard?.location) ||
      sanitizeLabel(staticItem?.location) ||
      sanitizeLabel(meta._address_line_1?.[0]) ||
      '',
    image,
    images: staticItem?.images?.length
      ? staticItem.images
      : image
        ? [image]
        : [],
    date: staticItem?.date || '',
    views: meta._total_clicks?.[0] || staticItem?.views || '',
    author: staticItem?.author || '',
    authorAvatar: staticItem?.authorAvatar || '',
    memberSince: staticItem?.memberSince || '',
    phone: meta._field_6?.[0] || staticItem?.phone || '',
    email: meta._field_8?.[0] || staticItem?.email || '',
    description: stripHtml(item.content) || staticItem?.description || '',
    url: `https://piatadetroc.ro/listings/${slug}/`,
  }
}

async function fetchStaticListings() {
  const res = await fetch(DATA_URL, { cache: 'no-store' })
  if (!res.ok) throw new Error('Static listings unavailable')
  const data = await res.json()
  return data.map(sanitizeListing)
}

async function fetchLiveApiItems() {
  const res = await fetch(LIVE_API)
  if (!res.ok) throw new Error('Live API unavailable')
  return res.json()
}

async function fetchHomepageHtml() {
  const res = await fetch(`${SITE_BASE}/`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Homepage unavailable')
  return res.text()
}

function buildLookupMaps(staticListings, homeCards) {
  return {
    staticById: new Map(staticListings.map((item) => [item.id, item])),
    staticByTitle: new Map(staticListings.map((item) => [item.title.toLowerCase(), item])),
    homeByTitle: new Map(homeCards.map((item) => [item.title.toLowerCase(), item])),
    homeBySlug: new Map(homeCards.map((item) => [item.slug, item])),
  }
}

function sortStaticByRecency(listings) {
  return [...listings].sort((a, b) => (b.id || 0) - (a.id || 0))
}

export async function fetchLatestListings({ force = false } = {}) {
  if (!force && latestCache && Date.now() - latestCacheTime < CACHE_TTL) {
    return latestCache
  }

  let staticListings = []
  try {
    staticListings = await fetchStaticListings()
  } catch {
    /* optional enrichment */
  }

  try {
    const [apiItems, homeHtml] = await Promise.all([
      fetchLiveApiItems(),
      fetchHomepageHtml().catch(() => null),
    ])
    const homeCards = homeHtml ? parseHomepageCards(homeHtml) : []
    const lookups = buildLookupMaps(staticListings, homeCards)

    const listings = [...apiItems]
      .sort((a, b) => getOrderDate(b) - getOrderDate(a))
      .map((item) => mapApiItemToListing(item, lookups))

    latestCache = listings
    latestCacheTime = Date.now()
    return listings
  } catch {
    if (staticListings.length) {
      const fallback = sortStaticByRecency(staticListings)
      latestCache = fallback
      latestCacheTime = Date.now()
      return fallback
    }
    if (latestCache) return latestCache
    throw new Error('Nu am putut incarca ultimele anunturi.')
  }
}

async function fetchLiveListings() {
  const apiItems = await fetchLiveApiItems()

  const sitemapRes = await fetch(`${SITE_BASE}/wp-sitemap-posts-dp_listing-1.xml`)
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
      authorAvatar: '',
      memberSince: '',
      phone: meta._field_6?.[0] || '',
      email: meta._field_8?.[0] || '',
      description: api?.content ? stripHtml(api.content) : '',
      url: `https://piatadetroc.ro/listings/${slug}/`,
    }
  })
}

async function enrichDescriptionsFromApi(listings) {
  try {
    const apiItems = await fetchLiveApiItems()
    const apiByTitle = new Map(apiItems.map((item) => [item.title.toLowerCase(), item]))
    return listings.map((listing) => {
      const api = apiByTitle.get(listing.title.toLowerCase())
      const apiDescription = api?.content ? stripHtml(api.content) : ''
      if (!apiDescription) return listing
      return { ...listing, description: apiDescription }
    })
  } catch {
    return listings
  }
}

export async function fetchAllListings({ force = false } = {}) {
  if (!force && cache && Date.now() - cacheTime < CACHE_TTL) {
    return cache
  }

  try {
    const data = await enrichDescriptionsFromApi(await fetchStaticListings())
    cache = data
    cacheTime = Date.now()
    return data
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
