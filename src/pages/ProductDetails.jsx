import { useEffect, useRef, useState } from 'react'
import { GitCompare, Heart, ShoppingBag, Zap } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { discountPercent, getProduct, getRelated, productBadges, serviceablePincodes } from '../data/store'
import { formatINR } from '../utils/format'
import { useAddToCart } from '../hooks/useAddToCart'
import { useCart } from '../context/CartContext'
import { useCompare } from '../context/CompareContext'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'
import { useToast } from '../context/ToastContext'
import { useWishlist } from '../context/WishlistContext'
import Badge from '../components/ui/Badge'
import SafeImage from '../components/ui/SafeImage'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import QuantitySelector from '../components/ui/QuantitySelector'
import StarRating from '../components/ui/StarRating'
import ProductGrid from '../components/product/ProductGrid'
import ReviewCard from '../components/product/ReviewCard'

const SAMPLE_PINS = ['411014', '411045', '560001', '400001']

function checkPin(pin) {
  const info = serviceablePincodes[pin]
  if (!info) return { ok: false, text: 'Sorry, we do not deliver to this pincode yet. Try 411014 or 560001.' }
  const fee = info.fee === 0 ? 'Free delivery' : `Delivery ${formatINR(info.fee)}`
  return { ok: true, text: `${fee} to ${info.area}, ${info.city} · arrives in ${info.eta}.` }
}

export default function ProductDetails() {
  const { id } = useParams()
  const product = getProduct(id)
  const navigate = useNavigate()
  const { pincode, savePincode } = useCart()
  const { addToCart, justAdded } = useAddToCart()
  const { push } = useToast()
  const galleryRef = useRef(null)
  const { toggle, has } = useWishlist()
  const { toggle: toggleCompare, has: inCompare } = useCompare()
  const { track, items: recent } = useRecentlyViewed()
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [variantId, setVariantId] = useState(product?.variants?.[0]?.id)
  const [pin, setPin] = useState(pincode)
  const [pinMsg, setPinMsg] = useState('')
  const [pinOk, setPinOk] = useState(null)
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 })

  useEffect(() => {
    if (product) {
      track(product.id)
      setVariantId(product.variants?.[0]?.id)
      setActive(0)
      setQty(1)
    }
  }, [product?.id])

  useEffect(() => {
    if (!pincode) return
    const result = checkPin(pincode)
    setPin(pincode)
    setPinOk(result.ok)
    setPinMsg(result.text)
  }, [pincode])

  if (!product) {
    return (
      <div className="shell py-10">
        <EmptyState title="Product not found" description="This item may have been moved to another aisle." />
      </div>
    )
  }

  const variant = product.variants.find((v) => v.id === variantId) || product.variants[0]
  const price = variant?.price ?? product.price
  const original = variant?.originalPrice ?? product.originalPrice
  const off = discountPercent(product, variant)
  const related = getRelated(product, 4)
  const maxQty = Math.max(1, product.stock || 20)
  const bars = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((r) => r.rating === star).length,
  }))

  const pointZoom = (clientX, clientY, el) => {
    const r = el.getBoundingClientRect()
    setZoom({
      on: true,
      x: Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)),
      y: Math.min(100, Math.max(0, ((clientY - r.top) / r.height) * 100)),
    })
  }

  const add = () => {
    addToCart(product, { quantity: qty, variantId: variant.id, startEl: galleryRef.current })
  }

  const buyNow = () => {
    add()
    navigate('/checkout')
  }

  const runPinCheck = (value = pin) => {
    const result = checkPin(value)
    setPinOk(result.ok)
    setPinMsg(result.text)
    if (result.ok) savePincode(value)
  }

  return (
    <div className="shell py-6 pb-24 lg:pb-6">
      <p className="text-sm text-fresh-600">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / {product.name}
      </p>
      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        <div>
          <div
            ref={galleryRef}
            className="ticket relative overflow-hidden zoom-lens"
            onMouseMove={(e) => pointZoom(e.clientX, e.clientY, e.currentTarget)}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
            onTouchStart={(e) => {
              const t = e.touches[0]
              pointZoom(t.clientX, t.clientY, e.currentTarget)
            }}
            onTouchMove={(e) => {
              const t = e.touches[0]
              pointZoom(t.clientX, t.clientY, e.currentTarget)
            }}
            onTouchEnd={() => setZoom((z) => ({ ...z, on: false }))}
          >
            <SafeImage
              src={product.images[active]}
              alt={product.name}
              className="aspect-square w-full object-cover transition duration-150"
              style={
                zoom.on
                  ? { transform: 'scale(2)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
                  : undefined
              }
            />
            <div className="absolute left-4 top-4 flex flex-col gap-1">
              {productBadges(product).map((b) => (
                <Badge key={b} type={b} />
              ))}
            </div>
            <p className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white">
              Hover or drag to zoom
            </p>
          </div>
          <div className="mt-3 flex gap-2">
            {product.images.map((src, i) => (
              <button
                key={`${product.id}-img-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${
                  i === active ? 'border-fresh-600' : 'border-transparent'
                }`}
              >
                <SafeImage src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="aisle-kicker">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-extrabold break-words sm:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <StarRating value={product.rating} showValue />
            <span className="text-sm text-fresh-600/70">{product.reviewsCount} ratings</span>
          </div>
          {product.stock < 25 && (
            <p className="mt-2 text-sm font-semibold text-amber-600">Only {product.stock} left in stock</p>
          )}
          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-extrabold sm:text-4xl">{formatINR(price)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-fresh-500 line-through">{formatINR(original)}</span>
                <span className="bg-[#b5481d] px-2 py-0.5 text-sm font-bold text-white">{off}% off</span>
              </>
            )}
          </div>
          {off > 0 && (
            <p className="mt-1 text-sm font-semibold text-fresh-700">You save {formatINR(original - price)}</p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-fresh-800/80 dark:text-fresh-100/75">{product.description}</p>

          <div className="mt-5">
            <p className="mb-2 text-sm font-bold">Size / pack</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                    variantId === v.id
                      ? 'border-fresh-600 bg-fresh-50 dark:bg-fresh-900'
                      : 'border-fresh-200 dark:border-fresh-800'
                  }`}
                >
                  {v.label} · {formatINR(v.price)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} max={maxQty} />
            <Button onClick={add} className="min-w-0 flex-1 sm:flex-none">
              <ShoppingBag size={16} /> {justAdded ? 'Added' : 'Add to cart'}
            </Button>
            <Button variant="amber" onClick={buyNow} className="min-w-0 flex-1 sm:flex-none">
              <Zap size={16} /> Buy now
            </Button>
            <button
              type="button"
              onClick={() => {
                const inWish = has(product.id)
                toggle(product.id)
                push(inWish ? 'Removed from wishlist' : 'Saved to wishlist')
              }}
              className={`grid h-11 w-11 place-items-center rounded-xl border ${
                has(product.id) ? 'border-rose-300 text-rose-500' : 'border-fresh-200 dark:border-fresh-800'
              }`}
              aria-label="Wishlist"
            >
              <Heart size={18} className={has(product.id) ? 'fill-rose-500' : ''} />
            </button>
            <button
              type="button"
              onClick={() => {
                const was = inCompare(product.id)
                const res = toggleCompare(product.id)
                if (res && !res.ok) push(res.error, 'error')
                else push(was ? 'Removed from compare' : 'Added to compare')
              }}
              className={`grid h-11 w-11 place-items-center rounded-xl border ${
                inCompare(product.id) ? 'border-fresh-600 bg-fresh-50 text-fresh-700 dark:bg-fresh-900' : 'border-fresh-200 dark:border-fresh-800'
              }`}
              aria-label="Compare"
            >
              <GitCompare size={18} />
            </button>
          </div>

          <div className="panel mt-6 p-4">
            <p className="text-sm font-bold">Check delivery availability</p>
            <form
              className="mt-2 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                runPinCheck()
              }}
            >
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Pincode"
                inputMode="numeric"
                className="h-11 w-36 rounded-xl border border-fresh-200 px-3 text-sm dark:border-fresh-800 dark:bg-fresh-950"
              />
              <Button type="submit" variant="outline">
                Check
              </Button>
            </form>
            {pinMsg && (
              <p className={`mt-2 text-sm ${pinOk ? 'text-fresh-700 dark:text-fresh-200' : 'text-rose-600'}`}>
                {pinMsg}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {SAMPLE_PINS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setPin(sample)
                    runPinCheck(sample)
                  }}
                  className="rounded-full bg-fresh-50 px-2.5 py-1 text-[11px] font-semibold text-fresh-800 dark:bg-fresh-900 dark:text-fresh-100"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-xl font-extrabold">Product description</h2>
          <p className="mt-3 text-sm leading-relaxed text-fresh-800/80 dark:text-fresh-100/75">{product.description}</p>
        </div>
        <div className="panel p-5">
          <h2 className="text-xl font-extrabold">Specifications</h2>
          <dl className="mt-3 divide-y divide-fresh-100 text-sm dark:divide-fresh-800">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-fresh-600">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-fresh-600">Brand</dt>
              <dd className="font-semibold">{product.brand}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-fresh-600">Unit</dt>
              <dd className="font-semibold">{variant?.label || product.unit}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-extrabold">Customer reviews and ratings</h2>
        <div className="panel mb-5 p-5">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-4xl font-extrabold">{product.rating.toFixed(1)}</p>
              <StarRating value={product.rating} showValue />
              <p className="mt-1 text-xs text-fresh-600">{product.reviewsCount} ratings</p>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              {bars.map((row) => (
                <div key={row.star} className="flex items-center gap-2 text-xs">
                  <span className="w-6">{row.star}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-fresh-100 dark:bg-fresh-900">
                    <div
                      className="h-full bg-amber-400"
                      style={{ width: `${product.reviews.length ? (row.count / product.reviews.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-6 text-right">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {product.reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-extrabold">Related products</h2>
        <ProductGrid products={related} />
      </div>

      {recent.filter((p) => p.id !== product.id).length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-extrabold">Recently viewed</h2>
          <ProductGrid products={recent.filter((p) => p.id !== product.id).slice(0, 4)} />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#ddd2b8] bg-[#fffaf2]/95 p-3 backdrop-blur lg:hidden dark:border-[#3a342c] dark:bg-[#1a1713]/95">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-extrabold">{formatINR(price)}</p>
            <p className="text-xs text-fresh-600">{variant?.label}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={add}>
              {justAdded ? 'Added' : 'Add'}
            </Button>
            <Button variant="amber" onClick={buyNow}>
              Buy now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
