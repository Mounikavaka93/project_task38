import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { discountPercent } from '../../data/store'
import { formatINR } from '../../utils/format'
import { useAddToCart } from '../../hooks/useAddToCart'
import { useUI } from '../../context/UIContext'
import Button from '../ui/Button'
import SafeImage from '../ui/SafeImage'
import Modal from '../ui/Modal'
import QuantitySelector from '../ui/QuantitySelector'
import StarRating from '../ui/StarRating'
import WishlistButton from './WishlistButton'

export default function QuickViewModal() {
  const { quickView, setQuickView } = useUI()
  const { addToCart, justAdded } = useAddToCart()
  const [qty, setQty] = useState(1)
  const [variantId, setVariantId] = useState(null)
  const imgRef = useRef(null)
  const product = quickView
  const variant = product?.variants?.find((v) => v.id === (variantId || product.variants?.[0]?.id)) || product?.variants?.[0]
  const price = variant?.price ?? product?.price
  const original = variant?.originalPrice ?? product?.originalPrice
  const off = product ? discountPercent(product, variant) : 0

  return (
    <Modal
      open={Boolean(product)}
      onClose={() => {
        setQuickView(null)
        setQty(1)
        setVariantId(null)
      }}
      title="Quick view"
      wide
    >
      {product && (
        <div className="grid gap-6 md:grid-cols-2">
          <div ref={imgRef}>
            <SafeImage src={product.images[0]} alt={product.name} className="aspect-square w-full rounded-2xl object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-fresh-600">{product.brand}</p>
            <h3 className="mt-1 text-2xl font-extrabold">{product.name}</h3>
            <div className="mt-2 flex items-center gap-2">
              <StarRating value={product.rating} showValue />
              <span className="text-xs text-fresh-600/70">{product.reviewsCount} reviews</span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-extrabold">{formatINR(price)}</span>
              {off > 0 && <span className="text-fresh-500 line-through">{formatINR(original)}</span>}
            </div>
            <p className="mt-3 text-sm text-fresh-700/80 dark:text-fresh-200/70">{product.description}</p>
            {product.variants?.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={`rounded-xl border px-3 py-1.5 text-sm font-semibold ${
                      (variantId || product.variants[0].id) === v.id
                        ? 'border-fresh-600 bg-fresh-50 dark:bg-fresh-900'
                        : 'border-fresh-200 dark:border-fresh-800'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-5 flex items-center gap-3">
              <QuantitySelector value={qty} onChange={setQty} />
              <WishlistButton productId={product.id} className="h-10 w-10 border border-fresh-200 dark:border-fresh-800" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  addToCart(product, { quantity: qty, variantId: variant?.id, startEl: imgRef.current })
                  setTimeout(() => setQuickView(null), 420)
                }}
              >
                {justAdded ? 'Added' : 'Add to cart'}
              </Button>
              <Button as={Link} to={`/product/${product.id}`} variant="outline" onClick={() => setQuickView(null)}>
                View details
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
