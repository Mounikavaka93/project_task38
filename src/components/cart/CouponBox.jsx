import { useState } from 'react'
import { coupons } from '../../data/store'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'

export default function CouponBox() {
  const { applyCoupon, clearCoupon, coupon, couponError } = useCart()
  const { push } = useToast()
  const [code, setCode] = useState('')

  return (
    <div className="panel p-4">
      <h4 className="font-bold">Coupon</h4>
      {coupon ? (
        <div className="mt-3 flex flex-col items-start justify-between gap-2 rounded-xl bg-fresh-50 px-3 py-2 text-sm sm:flex-row sm:items-center dark:bg-fresh-900/40">
          <span className="min-w-0 break-words">
            Applied <strong>{coupon.code}</strong> · {coupon.label}
          </span>
          <button type="button" className="font-semibold text-rose-500" onClick={clearCoupon}>
            Remove
          </button>
        </div>
      ) : (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const res = applyCoupon(code)
            if (res.ok) {
              push(`Coupon ${res.coupon.code} applied`)
              setCode('')
            } else push(res.error, 'error')
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="FRESH10"
            className="h-11 flex-1 rounded-xl border border-fresh-200 px-3 text-sm outline-none focus:border-fresh-500 dark:border-fresh-800 dark:bg-fresh-950"
          />
          <Button type="submit">Apply</Button>
        </form>
      )}
      {couponError && <p className="mt-2 text-xs text-amber-600">{couponError}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {coupons.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => {
              const res = applyCoupon(c.code)
              if (res.ok) push(`Coupon ${res.coupon.code} applied`)
              else push(res.error, 'error')
            }}
            className="rounded-full border border-dashed border-fresh-300 px-2.5 py-1 text-[11px] font-semibold"
          >
            {c.code}
          </button>
        ))}
      </div>
    </div>
  )
}
