import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { formatINR } from '../utils/format'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { useWishlist } from '../context/WishlistContext'
import ProductGrid from '../components/product/ProductGrid'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Input from '../components/ui/Input'

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'orders', label: 'My orders' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'addresses', label: 'Saved addresses' },
  { id: 'settings', label: 'Settings' },
]

export default function Account() {
  const { user, isAuthed, updateProfile, saveAddress, removeAddress, logout, orders } = useAuth()
  const { items: wish } = useWishlist()
  const { isDark, toggleTheme } = useTheme()
  const { push } = useToast()
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState(() => ({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  }))
  const [addr, setAddr] = useState({ label: 'Home', line1: '', city: '', pincode: '' })

  if (!isAuthed) return <Navigate to="/login" replace />

  return (
    <div className="shell py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="aisle-kicker">Member desk</p>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Hello, {user.name?.split(' ')[0] || 'there'}</h1>
          <p className="text-sm text-fresh-600">{user.email}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            logout()
            push('Logged out')
          }}
        >
          Logout
        </Button>
      </div>
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border border-[#ddd2b8] px-4 py-2 text-sm font-semibold dark:border-[#3a342c] ${
              tab === t.id ? 'bg-fresh-600 text-white' : 'bg-[#fffaf2] dark:bg-[#1a1713]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'profile' && (
          <form
            className="max-w-lg space-y-3 panel p-5"
            onSubmit={(e) => {
              e.preventDefault()
              updateProfile(form)
              push('Profile updated')
            }}
          >
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button type="submit">Save profile</Button>
          </form>
        )}

        {tab === 'orders' &&
          (orders.length ? (
            <div className="space-y-3">
              {orders.map((o) => (
                <article key={o.id} className="panel p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-extrabold">{o.id}</p>
                    <span className="rounded-full bg-fresh-100 px-2 py-0.5 text-xs font-bold text-fresh-800 dark:bg-fresh-900 dark:text-fresh-100">
                      {o.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-fresh-600">{new Date(o.createdAt).toLocaleString()}</p>
                  <ul className="mt-3 text-sm">
                    {o.items.map((i) => (
                      <li key={i.key}>
                        {i.name} × {i.qty}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 font-extrabold">{formatINR(o.total)}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No orders yet" />
          ))}

        {tab === 'wishlist' &&
          (wish.length ? <ProductGrid products={wish} /> : <EmptyState title="Wishlist is empty" actionTo="/products" />)}

        {tab === 'addresses' && (
          <div className="grid gap-4 lg:grid-cols-2">
            <form
              className="space-y-3 panel p-5"
              onSubmit={(e) => {
                e.preventDefault()
                saveAddress({ ...addr, id: crypto.randomUUID?.() || String(Date.now()) })
                push('Address saved')
                setAddr({ label: 'Home', line1: '', city: '', pincode: '' })
              }}
            >
              <h3 className="font-bold">Add address</h3>
              <Input label="Label" value={addr.label} onChange={(e) => setAddr({ ...addr, label: e.target.value })} />
              <Input label="Street" value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} />
              <Input label="City" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
              <Input label="Pincode" value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} />
              <Button type="submit">Save address</Button>
            </form>
            <div className="space-y-3">
              {(user.addresses || []).length === 0 && <EmptyState title="No saved addresses" actionLabel="" />}
              {(user.addresses || []).map((a) => (
                <div key={a.id} className="panel p-4">
                  <p className="font-bold">{a.label}</p>
                  <p className="text-sm text-fresh-700">
                    {a.line1}, {a.city} {a.pincode}
                  </p>
                  <button type="button" className="mt-2 text-sm font-semibold text-rose-500" onClick={() => removeAddress(a.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="max-w-lg panel p-5">
            <h3 className="font-bold">Account settings</h3>
            <p className="mt-2 text-sm text-fresh-700/80">
              Theme, cart and wishlist persist in this browser. Logout only clears the session — your saved
              profile stays until you overwrite it.
            </p>
            <Button className="mt-4" variant="outline" onClick={toggleTheme}>
              Switch to {isDark ? 'light' : 'dark'} mode
            </Button>
            <Button
              className="mt-3"
              variant="danger"
              onClick={() => {
                logout()
                push('Logged out')
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
