import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchAllListings } from '../services/listingsApi'

const ListingsContext = createContext(null)

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    <ListingsContext.Provider value={{ listings, loading, error, categories }}>
      {children}
    </ListingsContext.Provider>
  )
}

export function useListings() {
  const ctx = useContext(ListingsContext)
  if (!ctx) throw new Error('useListings must be used within ListingsProvider')
  return ctx
}
