import { Link } from 'react-router-dom'
import { products } from '../../data/store'
import { useCountdown } from '../../hooks/useCountdown'
import { readStorage, writeStorage } from '../../utils/storage'
import ProductCard from '../product/ProductCard'

function getFlashEnd() {
  const stored = readStorage('fb-flash-end', 0)
  if (stored && stored > Date.now()) return stored
  const next = Date.now() + 1000 * 60 * 60 * 26
  writeStorage('fb-flash-end', next)
  return next
}

const END = getFlashEnd()

function Pad({ n, label }) {
  return (
    <div className="min-w-14 border border-[#e3a008]/50 bg-[#101820] px-2 py-1.5 text-center text-[#f7f3ea]">
      <p className="font-display text-lg font-black">{String(n).padStart(2, '0')}</p>
      <p className="text-[10px] uppercase tracking-wide text-[#c4b189]">{label}</p>
    </div>
  )
}

export default function FlashSale() {
  const { hours, minutes, seconds, days, done } = useCountdown(END)
  const items = products.filter((p) => p.flashSale).slice(0, 4)

  return (
    <div className="border border-[#101820] bg-[#1e2d40] p-5 text-[#f7f3ea] sm:p-8 dark:border-[#e3a008]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="aisle-kicker !text-[#e3a008]">Tonight&apos;s board</p>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{done ? 'Board closed' : 'Flash list'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Pad n={days} label="days" />
          <Pad n={hours} label="hrs" />
          <Pad n={minutes} label="min" />
          <Pad n={seconds} label="sec" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4">
        {items.map((p) => (
          <div key={p.id} className="text-fresh-900">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link to="/products?deal=1" className="text-sm font-bold uppercase tracking-[0.16em] text-[#e3a008] underline decoration-[#e3a008]/40 underline-offset-4">
          See all deals
        </Link>
      </div>
    </div>
  )
}
