import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProduct } from '../../data/store'

const pages = {
  '/': 'Fresh Choice | Fresh Groceries Delivered',
  '/products': 'Shop groceries | Fresh Choice',
  '/cart': 'Your cart | Fresh Choice',
  '/checkout': 'Checkout | Fresh Choice',
  '/account': 'My account | Fresh Choice',
  '/login': 'Login | Fresh Choice',
  '/register': 'Create account | Fresh Choice',
  '/wishlist': 'Wishlist | Fresh Choice',
  '/compare': 'Compare products | Fresh Choice',
  '/order-confirmation': 'Order confirmed | Fresh Choice',
}

export default function DocumentTitle() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (pathname.startsWith('/product/')) {
      const product = getProduct(pathname.split('/')[2])
      document.title = product ? `${product.name} | Fresh Choice` : 'Product | Fresh Choice'
      return
    }
    document.title = pages[pathname] || 'Fresh Choice | Fresh Groceries Delivered'
  }, [pathname, search])

  return null
}
