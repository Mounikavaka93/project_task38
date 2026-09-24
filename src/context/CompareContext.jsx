import { createContext, useContext, useMemo, useState } from 'react'
import { getProduct } from '../data/store'
import { readStorage, writeStorage } from '../utils/storage'

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(() => readStorage('fb-compare', []))

  const persist = (next) => {
    setIds(next)
    writeStorage('fb-compare', next)
  }

  const toggle = (productId) => {
    if (ids.includes(productId)) persist(ids.filter((id) => id !== productId))
    else if (ids.length >= 3) return { ok: false, error: 'You can compare up to 3 products.' }
    else persist([...ids, productId])
    return { ok: true }
  }

  const clear = () => persist([])
  const has = (productId) => ids.includes(productId)
  const items = ids.map(getProduct).filter(Boolean)

  const value = useMemo(() => ({ ids, items, toggle, has, clear, count: ids.length }), [ids])

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
