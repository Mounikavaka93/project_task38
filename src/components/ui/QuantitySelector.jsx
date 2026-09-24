import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ value, onChange, min = 1, max = 20, size = 'md' }) {
  const compact = size === 'sm'
  return (
    <div
      className={`inline-flex items-center border border-[#ddd2b8] bg-[#fffaf2] dark:border-[#3a342c] dark:bg-[#1a1713] ${
        compact ? 'h-8' : 'h-10'
      }`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className={`grid place-items-center text-fresh-700 hover:bg-fresh-50 dark:text-fresh-200 dark:hover:bg-fresh-900 ${
          compact ? 'w-8' : 'w-10'
        }`}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={compact ? 12 : 14} />
      </button>
      <span className={`min-w-7 text-center text-sm font-bold ${compact ? 'px-1' : 'px-2'}`}>{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={`grid place-items-center text-fresh-700 hover:bg-fresh-50 dark:text-fresh-200 dark:hover:bg-fresh-900 ${
          compact ? 'w-8' : 'w-10'
        }`}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={compact ? 12 : 14} />
      </button>
    </div>
  )
}
