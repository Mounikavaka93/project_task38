import { Heart } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'
import ProductGrid from '../components/product/ProductGrid'
import EmptyState from '../components/ui/EmptyState'

export default function Wishlist() {
  const { items } = useWishlist()
  const { items: recent } = useRecentlyViewed()
  return (
    <div className="shell py-6">
      <p className="aisle-kicker">Saved slips</p>
      <h1 className="text-2xl font-extrabold sm:text-3xl">Wishlist</h1>
      <div className="mt-6">
        {items.length ? (
          <ProductGrid products={items} />
        ) : (
          <EmptyState icon={Heart} title="No saved items" description="Tap the heart on any product to collect it here." />
        )}
      </div>
      {recent.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-extrabold">Recently viewed</h2>
          <ProductGrid products={recent.slice(0, 4)} />
        </div>
      )}
    </div>
  )
}
