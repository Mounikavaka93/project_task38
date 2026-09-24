import { Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatINR } from '../../utils/format'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { useWishlist } from '../../context/WishlistContext'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import SafeImage from '../ui/SafeImage'
import QuantitySelector from '../ui/QuantitySelector'

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI()
  const { items, updateQty, removeItem, grandTotal, itemCount, deliveryFee } = useCart()
  const { toggle, has } = useWishlist()
  const { push } = useToast()

  return (
    <div className={`fixed inset-0 z-[70] ${cartOpen ? '' : 'pointer-events-none'}`}>
      <button
        type="button"
        className={`absolute inset-0 bg-fresh-950/45 transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeCart}
        aria-label="Close cart"
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-[min(100%,420px)] flex-col bg-[#fffaf2] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-[#1a1713] ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-fresh-100 px-5 py-4 dark:border-fresh-800">
          <h3 className="text-lg font-extrabold">Your basket ({itemCount})</h3>
          <button type="button" onClick={closeCart} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="px-2 py-10 text-center">
              <p className="text-sm text-fresh-600">Your basket is empty.</p>
              <Button as={Link} to="/products" className="mt-4" onClick={closeCart}>
                Start shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.key} className="panel flex gap-3 p-2 animate-fade-up">
                  <SafeImage src={item.product.images[0]} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.product.name}</p>
                    <p className="text-xs text-fresh-600/70">{item.variantLabel}</p>
                    <p className="text-sm font-extrabold">{formatINR(item.price)}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(n) => updateQty(item.key, n)}
                        size="sm"
                        max={Math.max(1, item.product.stock || 20)}
                      />
                      <button
                        type="button"
                        className="text-xs font-semibold text-fresh-600"
                        onClick={() => {
                          toggle(item.productId)
                          push(has(item.productId) ? 'Removed from wishlist' : 'Saved to wishlist')
                        }}
                      >
                        Wishlist
                      </button>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(item.key)} className="text-rose-500" aria-label="Remove">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-fresh-100 p-4 dark:border-fresh-800">
          <div className="mb-3 flex justify-between text-sm">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? 'Free' : formatINR(deliveryFee)}</span>
          </div>
          <div className="mb-4 flex justify-between font-extrabold">
            <span>Total</span>
            <span>{formatINR(grandTotal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button as={Link} to="/cart" variant="outline" onClick={closeCart}>
              View cart
            </Button>
            <Button as={Link} to="/checkout" onClick={closeCart} disabled={!items.length}>
              Checkout
            </Button>
          </div>
        </div>
      </aside>
    </div>
  )
}
