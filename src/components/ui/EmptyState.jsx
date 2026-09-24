import { ShoppingBag } from 'lucide-react'
import Button from './Button'
import { Link } from 'react-router-dom'

export default function EmptyState({
  icon: Icon = ShoppingBag,
  title = 'Nothing here yet',
  description = 'Start browsing the aisles and your basket will fill up.',
  actionTo = '/products',
  actionLabel = 'Browse products',
}) {
  return (
    <div className="panel flex flex-col items-center justify-center border-dashed px-6 py-16 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-fresh-100 text-fresh-700 dark:bg-fresh-900 dark:text-fresh-200">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-fresh-900 dark:text-fresh-50">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-fresh-700/80 dark:text-fresh-200/70">{description}</p>
      {actionLabel && (
        <Button as={Link} to={actionTo} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
