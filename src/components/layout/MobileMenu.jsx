import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/store'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useToast } from '../../context/ToastContext'
import { useUI } from '../../context/UIContext'

export default function MobileMenu() {
  const { mobileOpen, setMobileOpen } = useUI()
  const { isAuthed, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { push } = useToast()

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}>
      <button
        type="button"
        className={`absolute inset-0 bg-fresh-950/50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setMobileOpen(false)}
        aria-label="Close menu"
      />
      <aside
        className={`absolute inset-y-0 left-0 flex w-[min(88vw,340px)] flex-col bg-[#fffaf2] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-[#1a1713] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-fresh-100 px-4 py-4 dark:border-fresh-800">
          <p className="font-extrabold">Fresh Choice</p>
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-fresh-500">Categories</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${c.id}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-fresh-50 px-3 py-3 text-sm font-semibold dark:bg-fresh-900/50"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-sm font-semibold">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2">
              All products
            </Link>
            <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block py-2">
              Wishlist
            </Link>
            <Link to="/compare" onClick={() => setMobileOpen(false)} className="block py-2">
              Compare
            </Link>
            <Link to={isAuthed ? '/account' : '/login'} onClick={() => setMobileOpen(false)} className="block py-2">
              {isAuthed ? 'My account' : 'Login / Register'}
            </Link>
            {isAuthed && (
              <button
                type="button"
                className="block py-2 text-left"
                onClick={() => {
                  logout()
                  push('Logged out')
                  setMobileOpen(false)
                }}
              >
                Logout
              </button>
            )}
            <button type="button" className="block py-2 text-left" onClick={toggleTheme}>
              {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
