import { createContext, useContext, useMemo, useState } from 'react'
import { getProduct } from '../data/store'
import { readStorage, writeStorage } from '../utils/storage'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => readStorage('fb-wishlist', []))

  const persist = (next) => {
    setIds(next)
    writeStorage('fb-wishlist', next)
  }

  const toggle = (productId) => {
    persist(ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId])
  }

  const has = (productId) => ids.includes(productId)
  const items = ids.map(getProduct).filter(Boolean)

  const value = useMemo(() => ({ ids, items, toggle, has, count: ids.length }), [ids])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
