import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useCompare } from '../../context/CompareContext'
import CartDrawer from '../cart/CartDrawer'
import QuickViewModal from '../product/QuickViewModal'
import CartFly from '../ui/CartFly'
import ToastNotification from '../ui/ToastNotification'
import PageTransition from '../ui/PageTransition'
import CompareBar from './CompareBar'
import DocumentTitle from './DocumentTitle'
import Footer from './Footer'
import MobileMenu from './MobileMenu'
import Navbar from './Navbar'

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-0.5 bg-fresh-900/10 dark:bg-white/10">
      <div className="h-full bg-[#e3a008] transition-[width] duration-150 ease-out" style={{ width: `${progress * 100}%` }} />
    </div>
  )
}

export default function Layout() {
  const { count } = useCompare()
  const { pathname } = useLocation()
  const onProduct = pathname.startsWith('/product/')

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-[#f3eee4] text-fresh-900 dark:bg-[#12100d] dark:text-fresh-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:bg-[#fffaf2] focus:px-3 focus:py-2">
        Skip to content
      </a>
      <ScrollProgress />
      <DocumentTitle />
      <Navbar />
      <div aria-hidden className="shrink-0" style={{ height: 'var(--nav-h, 7.5rem)' }} />
      <main id="main" className={`min-w-0 flex-1 ${count ? (onProduct ? 'pb-40 lg:pb-24' : 'pb-24') : onProduct ? 'pb-24 lg:pb-0' : ''}`}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <CartDrawer />
      <MobileMenu />
      <QuickViewModal />
      <ToastNotification />
      <CartFly />
      <CompareBar />
    </div>
  )
}
