import { Heart } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { useToast } from '../../context/ToastContext'

export default function WishlistButton({ productId, className = '', size = 18 }) {
  const { has, toggle } = useWishlist()
  const { push } = useToast()
  const active = has(productId)

  return (
    <button
      type="button"
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
        push(active ? 'Removed from wishlist' : 'Saved to wishlist', 'success')
      }}
      className={`grid place-items-center bg-[#fffaf2]/92 shadow-[3px_3px_0_#101820] backdrop-blur transition duration-200 hover:translate-x-px hover:translate-y-px dark:bg-[#1a1713]/90 ${
        active ? 'text-rose-500 animate-heart-pop' : 'text-fresh-700 dark:text-fresh-200'
      } ${className}`}
    >
      <Heart size={size} className={active ? 'fill-rose-500' : ''} />
    </button>
  )
}
