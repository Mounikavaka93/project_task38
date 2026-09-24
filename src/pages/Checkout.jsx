import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deliverySlots } from '../data/store'
import { generateOrderId } from '../utils/format'
import { writeStorage } from '../utils/storage'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import CheckoutForm from '../components/cart/CheckoutForm'
import CouponBox from '../components/cart/CouponBox'
import OrderSummary from '../components/cart/OrderSummary'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

const payments = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Credit / Debit card' },
  { id: 'cod', label: 'Cash on delivery' },
  { id: 'wallet', label: 'Wallet' },
]

export default function Checkout() {
  const { items, grandTotal, clearCart, coupon, pincode } = useCart()
  const { user, isAuthed, addOrder } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const [slot, setSlot] = useState('evening')
  const [pay, setPay] = useState('upi')
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    line1: user?.addresses?.[0]?.line1 || '',
    city: user?.addresses?.[0]?.city || '',
    pincode: user?.addresses?.[0]?.pincode || pincode || '',
  })
  const [errors, setErrors] = useState({})

  if (!items.length) {
    return (
      <div className="shell py-10">
        <EmptyState title="Nothing to checkout" />
      </div>
    )
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const place = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a 10-digit phone'
    if (!form.email.includes('@')) next.email = 'Enter a valid email'
    if (!form.line1.trim()) next.line1 = 'Address is required'
    if (!form.city.trim()) next.city = 'City is required'
    if (form.pincode.length < 6) next.pincode = 'Enter a 6-digit pincode'
    setErrors(next)
    if (Object.keys(next).length) return push('Please complete the highlighted fields', 'error')

    const order = {
      id: generateOrderId(),
      items: items.map((i) => ({
        key: i.key,
        name: i.product.name,
        qty: i.quantity,
        price: i.price,
        image: i.product.images[0],
      })),
      total: grandTotal,
      coupon: coupon?.code || null,
      slot,
      pay,
      address: form,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
    }
    addOrder(order)
    writeStorage('fb-last-order', order)
    clearCart()
    push('Order placed successfully')
    navigate('/order-confirmation', { state: { order } })
  }

  return (
    <div className="shell py-6">
      <p className="aisle-kicker">The counter</p>
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      {!isAuthed && (
        <p className="mt-2 text-sm text-fresh-700">
          You can checkout as a guest.{' '}
          <Link to="/login" className="font-bold text-fresh-600">
            Login
          </Link>{' '}
          to save the order to your account.
        </p>
      )}
      <form onSubmit={place} className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <CheckoutForm form={form} errors={errors} onChange={set} />
          <section className="panel p-5">
            <h2 className="font-extrabold">Delivery slot</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {deliverySlots.map((s) => (
                <label
                  key={s.id}
                  className={`cursor-pointer rounded-xl border p-3 text-sm ${
                    slot === s.id ? 'border-fresh-600 bg-fresh-50 dark:bg-fresh-900' : 'border-fresh-200 dark:border-fresh-800'
                  }`}
                >
                  <input type="radio" className="sr-only" checked={slot === s.id} onChange={() => setSlot(s.id)} />
                  <p className="font-bold">{s.label}</p>
                  <p className="text-fresh-600/80">{s.time}</p>
                </label>
              ))}
            </div>
          </section>
          <section className="panel p-5">
            <h2 className="font-extrabold">Payment method</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {payments.map((p) => (
                <label
                  key={p.id}
                  className={`cursor-pointer rounded-xl border p-3 text-sm font-semibold ${
                    pay === p.id ? 'border-fresh-600 bg-fresh-50 dark:bg-fresh-900' : 'border-fresh-200 dark:border-fresh-800'
                  }`}
                >
                  <input type="radio" className="sr-only" checked={pay === p.id} onChange={() => setPay(p.id)} />
                  {p.label}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-fresh-600/70">This is a demo checkout. No real payment is processed.</p>
          </section>
        </div>
        <div className="space-y-4">
          <CouponBox />
          <OrderSummary sticky />
          <Button type="submit" className="w-full" size="lg">
            Place order
          </Button>
        </div>
      </form>
    </div>
  )
}
