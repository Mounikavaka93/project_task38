import { createContext, useContext, useMemo, useState } from 'react'
import { coupons, FREE_DELIVERY_MIN, BASE_DELIVERY_FEE, getProduct, serviceablePincodes } from '../data/store'
import { readStorage, writeStorage } from '../utils/storage'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStorage('fb-cart', []))
  const [couponCode, setCouponCode] = useState(() => readStorage('fb-coupon', ''))
  const [pincode, setPincode] = useState(() => readStorage('fb-pincode', ''))

  const persist = (updater) => {
    setItems((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      writeStorage('fb-cart', next)
      return next
    })
  }

  const addItem = (product, { quantity = 1, variantId } = {}) => {
    const variant = product.variants?.find((v) => v.id === (variantId || product.variants?.[0]?.id))
    const key = `${product.id}::${variant?.id || 'default'}`
    persist((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          variantId: variant?.id || null,
          variantLabel: variant?.label || product.unit,
          quantity,
          price: variant?.price ?? product.price,
          originalPrice: variant?.originalPrice ?? product.originalPrice,
        },
      ]
    })
  }

  const updateQty = (key, quantity) => {
    persist((prev) =>
      quantity <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, quantity } : i)),
    )
  }

  const removeItem = (key) => persist((prev) => prev.filter((i) => i.key !== key))
  const clearCart = () => persist([])

  const applyCoupon = (code) => {
    const found = coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase())
    if (!found) return { ok: false, error: 'Invalid coupon code.' }
    setCouponCode(found.code)
    writeStorage('fb-coupon', found.code)
    return { ok: true, coupon: found }
  }

  const clearCoupon = () => {
    setCouponCode('')
    writeStorage('fb-coupon', '')
  }

  const savePincode = (pin) => {
    setPincode(pin)
    writeStorage('fb-pincode', pin)
  }

  const hydrated = items
    .map((i) => {
      const product = getProduct(i.productId)
      if (!product) return null
      return { ...i, product }
    })
    .filter(Boolean)

  const itemCount = hydrated.reduce((s, i) => s + i.quantity, 0)
  const subtotal = hydrated.reduce((s, i) => s + i.price * i.quantity, 0)
  const originalSubtotal = hydrated.reduce((s, i) => s + (i.originalPrice || i.price) * i.quantity, 0)
  const productDiscount = originalSubtotal - subtotal

  const coupon = coupons.find((c) => c.code === couponCode) || null
  const pinInfo = serviceablePincodes[pincode]
  let couponDiscount = 0
  let deliveryFee = 0
  if (subtotal > 0 && subtotal < FREE_DELIVERY_MIN) {
    deliveryFee = pinInfo ? pinInfo.fee : BASE_DELIVERY_FEE
  }
  let couponError = ''

  if (coupon) {
    if (subtotal < coupon.min) {
      couponError = `Add ₹${coupon.min - subtotal} more to use ${coupon.code}`
    } else if (coupon.flashOnly) {
      const flashTotal = hydrated
        .filter((i) => i.product.flashSale)
        .reduce((s, i) => s + i.price * i.quantity, 0)
      couponDiscount = Math.round((flashTotal * coupon.value) / 100)
    } else if (coupon.type === 'percent') {
      couponDiscount = Math.round((subtotal * coupon.value) / 100)
    } else if (coupon.type === 'flat') {
      couponDiscount = coupon.value
    } else if (coupon.type === 'shipping') {
      deliveryFee = 0
    }
  }

  const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryFee)

  const value = useMemo(
    () => ({
      items: hydrated,
      rawItems: items,
      itemCount,
      subtotal,
      originalSubtotal,
      productDiscount,
      coupon,
      couponCode,
      couponDiscount,
      couponError,
      deliveryFee,
      grandTotal,
      pincode,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      applyCoupon,
      clearCoupon,
      savePincode,
    }),
    [items, couponCode, pincode, itemCount, subtotal, grandTotal, couponDiscount, deliveryFee, couponError],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
