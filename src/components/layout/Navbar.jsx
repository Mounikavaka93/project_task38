import { useEffect, useRef, useState } from 'react'
import { Heart, Menu, Moon, ShoppingBag, Sun, User } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import { useUI } from '../../context/UIContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import LocationPicker from './LocationPicker'
import SearchBar from './SearchBar'
import MegaMenu from './MegaMenu'

export default function Navbar() {
  const { itemCount } = useCart()
  const { count: wishCount } = useWishlist()
  const { openCart, setMobileOpen, cartBump } = useUI()
  const { isDark, toggleTheme } = useTheme()
  const { isAuthed, user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [pop, setPop] = useState(false)
  const headerRef = useRef(null)
  const edition = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const sync = () => {
      document.documentElement.style.setProperty('--nav-h', `${el.offsetHeight}px`)
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty('--nav-h')
    }
  }, [])

  useEffect(() => {
    if (!cartBump) return
    setPop(true)
    const id = setTimeout(() => setPop(false), 450)
    return () => clearTimeout(id)
  }, [cartBump])

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${scrolled ? 'shadow-[0_8px_0_#101820]' : ''}`}
    >
      <div className="bg-[#101820] text-[#f7f3ea]">
        <div className="shell flex items-center justify-between gap-3 py-1.5 text-[11px] sm:text-xs">
          <LocationPicker />
          <p className="hidden font-semibold uppercase tracking-[0.18em] text-[#c4b189] sm:block">
            Evening edition · {edition} · Free van above ₹499
          </p>
          <p className="font-semibold uppercase tracking-[0.14em] text-[#e3a008] sm:hidden">Vol. 38</p>
        </div>
      </div>
      <div className="glass border-b border-fresh-200 dark:border-[#3a342c]">
        <div className="shell flex min-w-0 items-center gap-1.5 py-2 sm:gap-3 sm:py-3">
          <button
            type="button"
            className="grid h-9 w-9 shrink-0 place-items-center text-fresh-800 sm:h-10 sm:w-10 lg:hidden dark:text-fresh-100"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center border border-[#101820] bg-[#101820] text-lg font-black text-[#f7f3ea] dark:border-[#e3a008]">
              F
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-lg font-extrabold tracking-tight text-fresh-900 dark:text-fresh-50">
                Fresh Choice
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a6f32]">
                Market gazette
              </span>
            </span>
          </Link>
          <div className="hidden flex-1 md:block">
            <SearchBar />
          </div>
          <nav className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center hover:bg-fresh-100 sm:h-10 sm:w-10 dark:hover:bg-fresh-900"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <NavLink
              to={isAuthed ? '/account' : '/login'}
              className="hidden items-center gap-2 px-2 py-2 text-sm font-semibold hover:bg-fresh-100 dark:hover:bg-fresh-900 sm:flex"
            >
              <User size={18} />
              <span className="hidden lg:inline">{isAuthed ? user.name?.split(' ')[0] || 'Account' : 'Account'}</span>
            </NavLink>
            <Link
              to="/wishlist"
              className="relative grid h-9 w-9 place-items-center hover:bg-fresh-100 sm:h-10 sm:w-10 dark:hover:bg-fresh-900"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center bg-[#b5481d] px-1 text-[10px] font-bold text-white">
                  {wishCount}
                </span>
              )}
            </Link>
            <button
              id="nav-cart-btn"
              type="button"
              onClick={openCart}
              className={`relative grid h-9 w-9 place-items-center transition hover:bg-fresh-100 sm:h-10 sm:w-10 dark:hover:bg-fresh-900 ${
                pop ? 'animate-cart-pop' : ''
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span
                  key={cartBump}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center bg-[#e3a008] px-1 text-[10px] font-bold text-[#1f1b16] animate-badge-bounce"
                >
                  {itemCount}
                </span>
              )}
            </button>
          </nav>
        </div>
        <div className="shell pb-3 md:hidden">
          <SearchBar compact />
        </div>
      </div>
      <div className="masthead-rule" />
      <MegaMenu />
    </header>
  )
}
