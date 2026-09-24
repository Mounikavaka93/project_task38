import { useRef } from 'react'
import { Check, Eye, GitCompare, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { discountPercent, productBadges } from '../../data/store'
import { formatINR } from '../../utils/format'
import { useAddToCart } from '../../hooks/useAddToCart'
import { useCompare } from '../../context/CompareContext'
import { useToast } from '../../context/ToastContext'
import { useUI } from '../../context/UIContext'
import Badge from '../ui/Badge'
import SafeImage from '../ui/SafeImage'
import StarRating from '../ui/StarRating'
import WishlistButton from './WishlistButton'

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart, justAdded } = useAddToCart()
  const { push } = useToast()
  const { setQuickView } = useUI()
  const { toggle: toggleCompare, has: inCompare } = useCompare()
  const imgRef = useRef(null)
  const off = discountPercent(product)
  const badges = productBadges(product)

  const add = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, { startEl: imgRef.current })
  }

  if (layout === 'list') {
    return (
      <article className="ticket group flex gap-4 p-3 transition duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5">
        <Link to={`/product/${product.id}`} className="relative h-28 w-28 shrink-0 overflow-hidden sm:h-36 sm:w-36">
          <div ref={imgRef} className="h-full w-full">
            <SafeImage src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {badges.map((b) => (
              <Badge key={b} type={b} />
            ))}
          </div>
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8a6f32]">{product.brand}</p>
          <Link to={`/product/${product.id}`} className="mt-0.5 line-clamp-2 font-bold text-fresh-900 dark:text-fresh-50">
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 hidden text-sm text-fresh-700/70 dark:text-fresh-200/60 sm:block">
            {product.description}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={product.rating} showValue />
            <span className="text-xs text-fresh-600/70">({product.reviewsCount})</span>
          </div>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
            <div>
              <span className="text-lg font-extrabold text-fresh-800 dark:text-fresh-100">{formatINR(product.price)}</span>
              {off > 0 && (
                <span className="ml-2 text-sm text-fresh-500 line-through">{formatINR(product.originalPrice)}</span>
              )}
              <p className="text-xs text-fresh-600/70">{product.unit}</p>
            </div>
            <div className="flex items-center gap-2">
              <WishlistButton productId={product.id} className="h-9 w-9" />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  const wasCompared = inCompare(product.id)
                  const res = toggleCompare(product.id)
                  if (res && !res.ok) push(res.error, 'error')
                  else push(wasCompared ? 'Removed from compare' : 'Added to compare')
                }}
                className={`grid h-9 w-9 place-items-center border ${
                  inCompare(product.id) ? 'border-[#101820] bg-[#e3a008] text-[#1f1b16]' : 'border-[#ddd2b8] dark:border-[#3a342c]'
                }`}
                aria-label="Compare"
              >
                <GitCompare size={16} />
              </button>
              <button
                type="button"
                onClick={add}
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white transition duration-200 ${
                  justAdded ? 'bg-[#1e5c3a]' : 'bg-fresh-600 hover:bg-fresh-700'
                }`}
              >
                {justAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
                {justAdded ? 'Added' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="ticket group relative flex h-full flex-col transition duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-fresh-50 dark:bg-fresh-950">
        <div ref={imgRef} className="h-full w-full">
          <SafeImage
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        </div>
        <span className="card-shine" />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {badges.map((b) => (
            <Badge key={b} type={b} />
          ))}
        </div>
        <WishlistButton productId={product.id} className="absolute right-2 top-2 h-9 w-9" />
        <div className="absolute inset-x-2 bottom-2 flex translate-y-0 justify-center gap-2 opacity-100 transition duration-300 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setQuickView(product)
            }}
            className="grid h-9 w-9 place-items-center bg-[#fffaf2] text-fresh-800 shadow-[3px_3px_0_#101820] transition hover:translate-x-px hover:translate-y-px"
            aria-label="Quick view"
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const wasCompared = inCompare(product.id)
              const res = toggleCompare(product.id)
              if (res && !res.ok) push(res.error, 'error')
              else push(wasCompared ? 'Removed from compare' : 'Added to compare')
            }}
            className={`grid h-9 w-9 place-items-center shadow-[3px_3px_0_#101820] transition hover:translate-x-px hover:translate-y-px ${
              inCompare(product.id) ? 'bg-[#101820] text-[#e3a008]' : 'bg-[#fffaf2] text-fresh-800'
            }`}
            aria-label="Compare"
          >
            <GitCompare size={16} />
          </button>
        </div>
      </Link>
      <div className="flex flex-1 flex-col border-t border-dashed border-[#ddd2b8] p-3 dark:border-[#3a342c]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a6f32]">
          {product.brand}
        </p>
        <Link to={`/product/${product.id}`} className="mt-0.5 line-clamp-2 min-h-10 text-sm font-bold text-fresh-900 dark:text-fresh-50">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1">
          <StarRating value={product.rating} size={12} />
          <span className="text-[11px] text-fresh-600/70">({product.reviewsCount})</span>
        </div>
        <p className="mt-1 text-xs text-fresh-600/70">{product.unit}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-fresh-800 dark:text-fresh-100">{formatINR(product.price)}</span>
              {off > 0 && (
                <span className="text-xs text-fresh-500 line-through">{formatINR(product.originalPrice)}</span>
              )}
            </div>
            {off > 0 && <p className="text-[11px] font-semibold text-[#b5481d]">{off}% off</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={add}
          className={`mt-3 inline-flex h-10 w-full items-center justify-center gap-2 text-sm font-semibold text-white transition duration-200 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 ${
            justAdded ? 'bg-[#1e5c3a]' : 'bg-fresh-600 hover:bg-fresh-700'
          }`}
        >
          {justAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
          {justAdded ? 'Added' : <><span className="sm:hidden">Add</span><span className="hidden sm:inline">Add to cart</span></>}
        </button>
      </div>
    </article>
  )
}
