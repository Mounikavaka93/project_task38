import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)
  const [cartBump, setCartBump] = useState(0)
  const [flyers, setFlyers] = useState([])

  const openCart = () => setCartOpen(true)
  const closeCart = () => setCartOpen(false)
  const bumpCart = useCallback(() => setCartBump((n) => n + 1), [])

  const flyToCart = useCallback(
    (image, startEl) => {
      const cart = document.getElementById('nav-cart-btn')
      const from = startEl?.getBoundingClientRect?.()
      const to = cart?.getBoundingClientRect?.()
      if (!image || !from || !to) {
        bumpCart()
        return
      }
      const id = crypto.randomUUID?.() ?? String(Date.now() + Math.random())
      setFlyers((list) => [...list, { id, image, from, to }])
      window.setTimeout(() => {
        setFlyers((list) => list.filter((f) => f.id !== id))
        bumpCart()
      }, 640)
    },
    [bumpCart],
  )

  const value = useMemo(
    () => ({
      cartOpen,
      openCart,
      closeCart,
      mobileOpen,
      setMobileOpen,
      quickView,
      setQuickView,
      cartBump,
      bumpCart,
      flyers,
      flyToCart,
    }),
    [cartOpen, mobileOpen, quickView, cartBump, flyers, bumpCart, flyToCart],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
