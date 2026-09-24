import { Link } from 'react-router-dom'
import { discountPercent } from '../data/store'
import { formatINR } from '../utils/format'
import { useCompare } from '../context/CompareContext'
import Button from '../components/ui/Button'
import SafeImage from '../components/ui/SafeImage'
import EmptyState from '../components/ui/EmptyState'
import StarRating from '../components/ui/StarRating'

export default function Compare() {
  const { items, clear, toggle } = useCompare()
  if (!items.length) {
    return (
      <div className="shell py-10">
        <EmptyState title="Nothing to compare" description="Add up to three products from the catalog." />
      </div>
    )
  }

  const rows = [
    { key: 'brand', label: 'Brand', render: (p) => p.brand },
    { key: 'category', label: 'Category', render: (p) => p.category },
    { key: 'price', label: 'Price', render: (p) => formatINR(p.price) },
    { key: 'mrp', label: 'MRP', render: (p) => formatINR(p.originalPrice) },
    { key: 'off', label: 'Discount', render: (p) => `${discountPercent(p)}%` },
    { key: 'rating', label: 'Rating', render: (p) => <StarRating value={p.rating} showValue /> },
    { key: 'unit', label: 'Unit', render: (p) => p.unit },
    { key: 'stock', label: 'Stock', render: (p) => p.stock },
    { key: 'variants', label: 'Packs', render: (p) => p.variants.map((v) => v.label).join(', ') },
  ]

  return (
    <div className="shell py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="aisle-kicker">Side by side</p>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Compare</h1>
        </div>
        <Button variant="outline" onClick={clear}>
          Clear
        </Button>
      </div>
      <div className="overflow-x-auto">
      <table className="panel min-w-[640px] w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-3 text-left"> </th>
            {items.map((p) => (
              <th key={p.id} className="p-3 text-left">
                <SafeImage src={p.images[0]} alt={p.name} className="mb-2 h-28 w-full rounded-xl object-cover" />
                <Link to={`/product/${p.id}`} className="font-bold hover:text-fresh-600">
                  {p.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-fresh-100 dark:border-fresh-800">
              <td className="p-3 font-semibold">{row.label}</td>
              {items.map((p) => (
                <td key={p.id} className="p-3">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-fresh-100 dark:border-fresh-800">
            <td className="p-3" />
            {items.map((p) => (
              <td key={p.id} className="p-3">
                <button type="button" className="text-sm font-semibold text-rose-500" onClick={() => toggle(p.id)}>
                  Remove
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  )
}
