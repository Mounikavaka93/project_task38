import { Link } from 'react-router-dom'
import { categories } from '../../data/store'

export default function Footer() {
  return (
    <footer className="border-t-4 border-[#e3a008] bg-[#101820] text-[#f7f3ea]">
      <div className="shell border-b border-white/10 py-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#e3a008]">Colophon</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <Link to="/" className="font-display text-2xl font-extrabold">
            Fresh Choice
          </Link>
          <p className="text-xs uppercase tracking-[0.16em] text-[#c4b189]">
            Evening mandi · Pune edition · Open 7:00 AM – 10:00 PM
          </p>
        </div>
      </div>
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm leading-relaxed text-[#efe6d4]/75">
            A neighbourhood supermarket printed like a gazette. Fresh produce, pantry staples and
            household essentials delivered in carefully chosen slots.
          </p>
          <p className="mt-4 text-xs text-[#c4b189]">12 Market Lane, Kharadi · Pune 411014</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e3a008]">Aisles</p>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.slice(0, 8).map((c) => (
              <li key={c.id}>
                <Link to={`/products?category=${c.id}`} className="hover:text-[#e3a008]">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e3a008]">Desk</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/account" className="hover:text-[#e3a008]">
                Your orders
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-[#e3a008]">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-[#e3a008]">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/compare" className="hover:text-[#e3a008]">
                Compare
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-[#e3a008]">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-[#e3a008]">
                Create account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e3a008]">Visit</p>
          <p className="mt-3 text-sm text-[#efe6d4]/75">hello@freshchoice.shop</p>
          <p className="mt-3 text-sm text-[#efe6d4]/75">UPI · Cards · COD · Wallets</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            <Link to="/products?deal=1" className="border border-[#c4b189]/40 px-3 py-1.5 hover:border-[#e3a008] hover:text-[#e3a008]">
              Deals
            </Link>
            <Link to="/products" className="border border-[#c4b189]/40 px-3 py-1.5 hover:border-[#e3a008] hover:text-[#e3a008]">
              All products
            </Link>
          </div>
          <div className="mt-4 flex gap-3 text-xs font-bold">
            <span className="grid h-9 w-9 place-items-center border border-white/15">Ig</span>
            <span className="grid h-9 w-9 place-items-center border border-white/15">Fb</span>
            <span className="grid h-9 w-9 place-items-center border border-white/15">X</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-[#c4b189]">
        © {new Date().getFullYear()} Fresh Choice. Built for a frontend assignment — dummy catalog, local cart.
      </div>
    </footer>
  )
}
