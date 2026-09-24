import { Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatINR } from '../utils/format'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useWishlist } from '../context/WishlistContext'
import CouponBox from '../components/cart/CouponBox'
import OrderSummary from '../components/cart/OrderSummary'
import Button from '../components/ui/Button'
import SafeImage from '../components/ui/SafeImage'
import EmptyState from '../components/ui/EmptyState'
import QuantitySelector from '../components/ui/QuantitySelector'

export default function Cart() {
  const { items, updateQty, removeItem, productDiscount, couponDiscount } = useCart()
  const { toggle, has } = useWishlist()
  const { push } = useToast()

  if (!items.length) {
    return (
      <div className="shell py-10">
        <EmptyState
          title="Your cart is empty"
          description="Add produce, dairy or pantry staples to get started."
          actionTo="/products"
          actionLabel="Continue shopping"
        />
      </div>
    )
  }

  return (
    <div className="shell py-6">
      <p className="aisle-kicker">Your crate</p>
      <h1 className="text-2xl font-extrabold sm:text-3xl">Shopping cart</h1>
      <p className="mt-1 text-sm text-fresh-600">{items.length} item{items.length === 1 ? '' : 's'} in your basket</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((item) => {
            const line = item.price * item.quantity
            const was = (item.originalPrice || item.price) * item.quantity
            const save = was - line
            return (
              <article
                key={item.key}
                className="panel flex min-w-0 flex-col gap-3 p-3 sm:flex-row"
              >
                <Link to={`/product/${item.productId}`}>
                  <SafeImage src={item.product.images[0]} alt={item.product.name} className="h-28 w-full rounded-xl object-cover sm:w-28" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${item.productId}`} className="font-bold hover:text-fresh-600">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-fresh-600/70">{item.variantLabel}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-lg font-extrabold">{formatINR(item.price)}</p>
                    {save > 0 && (
                      <p className="text-sm text-fresh-500 line-through">{formatINR(item.originalPrice)}</p>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(n) => updateQty(item.key, n)}
                      max={Math.max(1, item.product.stock || 20)}
                    />
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-fresh-700"
                      onClick={() => {
                        const inWish = has(item.productId)
                        toggle(item.productId)
                        push(inWish ? 'Removed from wishlist' : 'Saved to wishlist')
                      }}
                    >
                      <Heart size={14} className={has(item.productId) ? 'fill-rose-500 text-rose-500' : ''} />
                      {has(item.productId) ? 'Saved' : 'Move to wishlist'}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500"
                      onClick={() => {
                        removeItem(item.key)
                        push('Removed from cart')
                      }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold">{formatINR(line)}</p>
                  {save > 0 && <p className="text-xs font-semibold text-fresh-600">Saved {formatINR(save)}</p>}
                </div>
              </article>
            )
          })}
          <Button as={Link} to="/products" variant="outline">
            Continue shopping
          </Button>
        </div>
        <div className="space-y-4">
          <CouponBox />
          <OrderSummary sticky />
          {(productDiscount > 0 || couponDiscount > 0) && (
            <p className="text-center text-sm font-semibold text-fresh-700">
              Total savings {formatINR(productDiscount + couponDiscount)}
            </p>
          )}
          <Button as={Link} to="/checkout" className="w-full" size="lg">
            Proceed to checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
