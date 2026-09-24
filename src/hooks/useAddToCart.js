import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useUI } from '../context/UIContext'

export function useAddToCart() {
  const { addItem } = useCart()
  const { flyToCart } = useUI()
  const { push } = useToast()
  const [justAdded, setJustAdded] = useState(false)

  const addToCart = (product, { quantity = 1, variantId, startEl } = {}) => {
    addItem(product, { quantity, variantId })
    flyToCart(product.images[0], startEl)
    push(`${product.name} added to cart`)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 900)
  }

  return { addToCart, justAdded }
}
