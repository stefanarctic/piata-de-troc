import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { fetchCurrentUser } from '../services/userApi'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshUser = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCurrentUser()
      setUser(data)
    } catch (err) {
      setUser(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
