import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { serviceablePincodes } from '../../data/store'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'

export default function LocationPicker() {
  const { pincode, savePincode } = useCart()
  const { push } = useToast()
  const [open, setOpen] = useState(false)
  const [pin, setPin] = useState(pincode)
  const wrap = useRef(null)
  const info = serviceablePincodes[pincode]

  useEffect(() => setPin(pincode), [pincode])

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const check = (e) => {
    e?.preventDefault()
    const found = serviceablePincodes[pin]
    if (found) {
      savePincode(pin)
      push(`Delivering to ${found.area}, ${found.city}`)
      setOpen(false)
    } else {
      push('We do not deliver to this pincode yet.', 'error')
    }
  }

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex max-w-[min(58vw,220px)] items-center gap-1.5 text-left hover:underline"
      >
        <MapPin size={13} className="shrink-0" />
        <span className="truncate">
          {info ? `${info.area}, ${info.city}` : 'Set delivery pincode'}
        </span>
      </button>
      {open && (
        <div className="ticket absolute left-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-1.5rem))] p-3 text-fresh-900 animate-dropdown dark:text-fresh-50">
          <p className="text-sm font-bold">Check delivery</p>
          <p className="mt-1 text-xs text-fresh-600 dark:text-fresh-300">Try 411014, 560001, 400050, 500081</p>
          <form className="mt-3 flex gap-2" onSubmit={check}>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit pincode"
              className="h-10 flex-1 rounded-xl border border-fresh-200 px-3 text-sm outline-none focus:border-fresh-500 dark:border-fresh-800 dark:bg-fresh-950"
            />
            <button type="submit" className="rounded-xl bg-fresh-600 px-3 text-sm font-bold text-white">
              Check
            </button>
          </form>
          {info && pincode === pin && (
            <p className="mt-2 text-xs text-fresh-700 dark:text-fresh-200">
              Arrives in {info.eta}
              {info.fee ? ` · delivery ₹${info.fee}` : ' · free delivery'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
