import { Link, useLocation } from 'react-router-dom'
import { useCompare } from '../../context/CompareContext'
import Button from '../ui/Button'
import SafeImage from '../ui/SafeImage'

export default function CompareBar() {
  const { items, clear, count } = useCompare()
  const { pathname } = useLocation()
  if (!count) return null
  const lift = pathname.startsWith('/product/')
  return (
    <div className={`ticket fixed left-1/2 z-40 w-[min(calc(100%-1rem),720px)] -translate-x-1/2 p-3 ${lift ? 'bottom-24 lg:bottom-4' : 'bottom-4'}`}>
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="flex -space-x-2">
          {items.map((p) => (
            <SafeImage key={p.id} src={p.images[0]} alt={p.name} className="h-8 w-8 rounded-full border-2 border-white object-cover sm:h-10 sm:w-10" />
          ))}
        </div>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold">{count} in compare</p>
        <button type="button" className="text-xs font-semibold text-rose-500" onClick={clear}>
          Clear
        </button>
        <Button as={Link} to="/compare" size="sm">
          Compare
        </Button>
      </div>
    </div>
  )
}
