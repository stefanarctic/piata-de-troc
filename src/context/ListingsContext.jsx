import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchAllListings, fetchLatestListings } from '../services/listingsApi'

const ListingsContext = createContext(null)

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState([])
  const [latestListings, setLatestListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [latestLoading, setLatestLoading] = useState(true)
  const [error, setError] = useState(null)
  const [latestError, setLatestError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchAllListings()
      .then((data) => {
        if (!cancelled) {
          setListings(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchLatestListings()
      .then((data) => {
        if (!cancelled) {
          setLatestListings(data)
          setLatestLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLatestError(err.message)
          setLatestLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const counts = {}
    listings.forEach((item) => {
      if (item.category) counts[item.category] = (counts[item.category] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [listings])

  return (
    <ListingsContext.Provider
      value={{
        listings,
        latestListings,
        loading,
        latestLoading,
        error,
        latestError,
        categories,
      }}
    >
      {children}
    </ListingsContext.Provider>
  )
}

export function useListings() {
  const ctx = useContext(ListingsContext)
  if (!ctx) throw new Error('useListings must be used within ListingsProvider')
  return ctx
}
