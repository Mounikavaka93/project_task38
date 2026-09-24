import { Link } from 'react-router-dom'
import SafeImage from '../ui/SafeImage'

const aisleNo = {
  vegetables: '01',
  fruits: '02',
  dairy: '03',
  bakery: '04',
  meat: '05',
  grocery: '06',
  beverages: '07',
  snacks: '08',
  frozen: '09',
  household: '10',
  personal: '11',
  baby: '12',
}

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="ticket group relative block min-w-[140px] transition duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 sm:min-w-0"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <SafeImage
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
      </div>
      <span className="card-shine" />
      <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-45 mix-blend-multiply`} />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e3a008]">
          Aisle {aisleNo[category.id] || '—'}
        </p>
        <p className="text-sm font-bold text-white drop-shadow">{category.name}</p>
      </div>
    </Link>
  )
}
