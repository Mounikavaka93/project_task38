import { Star } from 'lucide-react'

export default function StarRating({ value = 0, size = 14, showValue = false }) {
  const full = Math.round(value)
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < full ? 'fill-amber-400 text-amber-400' : 'text-fresh-200 dark:text-fresh-800'}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-fresh-800 dark:text-fresh-200">{value.toFixed(1)}</span>
      )}
    </div>
  )
}
