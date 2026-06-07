const PLACEHOLDER = '/placeholder-listing.svg'

const INVALID_PREFIXES = ['data:', 'blob:']

export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  return !INVALID_PREFIXES.some((p) => url.startsWith(p))
}

export function getListingImage(listing) {
  const candidates = [
    listing?.image,
    ...(listing?.images || []),
  ].filter(isValidImageUrl)

  return candidates[0] || PLACEHOLDER
}

export function listingImageProps(listing) {
  const src = getListingImage(listing)
  return {
    src,
    onError: (e) => {
      if (e.currentTarget.src !== PLACEHOLDER) {
        e.currentTarget.src = PLACEHOLDER
      }
    },
  }
}
