import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getProduct } from '../data/store'
import { readStorage, writeStorage } from '../utils/storage'

const RecentlyViewedContext = createContext(null)

export function RecentlyViewedProvider({ children }) {
  const [ids, setIds] = useState(() => readStorage('fb-recent', []))

  const track = useCallback((productId) => {
    setIds((prev) => {
      if (prev[0] === productId) return prev
      const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, 8)
      writeStorage('fb-recent', next)
      return next
    })
  }, [])

  const items = ids.map(getProduct).filter(Boolean)
  const value = useMemo(() => ({ items, track }), [ids])

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return ctx
}
