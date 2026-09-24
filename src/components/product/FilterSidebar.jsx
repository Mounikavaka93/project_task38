import { PRICE_CEILING, brands, categories } from '../../data/store'
import StarRating from '../ui/StarRating'

const emptyFilters = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: PRICE_CEILING,
  minRating: 0,
}

export default function FilterSidebar({ filters, setFilters, open, onClose, onReset }) {
  const toggle = (key, value) => {
    setFilters((f) => {
      const list = f[key]
      return {
        ...f,
        [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      }
    })
  }

  const body = (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-bold text-fresh-900 dark:text-fresh-50">Category</h4>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.categories.includes(c.id)}
                onChange={() => toggle('categories', c.id)}
                className="accent-fresh-600"
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-bold text-fresh-900 dark:text-fresh-50">Brand</h4>
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.brands.includes(b)}
                onChange={() => toggle('brands', b)}
                className="accent-fresh-600"
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-bold text-fresh-900 dark:text-fresh-50">Price range</h4>
        <label className="block text-xs text-fresh-600">Min ₹{filters.minPrice}</label>
        <input
          type="range"
          min="0"
          max={PRICE_CEILING}
          step="10"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              minPrice: Math.min(Number(e.target.value), f.maxPrice),
            }))
          }
          className="w-full accent-fresh-600"
        />
        <label className="mt-2 block text-xs text-fresh-600">Max ₹{filters.maxPrice}</label>
        <input
          type="range"
          min="0"
          max={PRICE_CEILING}
          step="10"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              maxPrice: Math.max(Number(e.target.value), f.minPrice),
            }))
          }
          className="w-full accent-fresh-600"
        />
        <p className="mt-1 text-xs text-fresh-700 dark:text-fresh-300">
          ₹{filters.minPrice} – ₹{filters.maxPrice}
        </p>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-bold text-fresh-900 dark:text-fresh-50">Rating</h4>
        {[4, 3, 2].map((r) => (
          <label key={r} className="mb-2 flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === r}
              onChange={() => setFilters((f) => ({ ...f, minRating: r }))}
              className="accent-fresh-600"
            />
            <StarRating value={r} size={12} />
            <span>& up</span>
          </label>
        ))}
        <button
          type="button"
          className="text-xs font-semibold text-fresh-600"
          onClick={() => setFilters((f) => ({ ...f, minRating: 0 }))}
        >
          Clear rating
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          setFilters({ ...emptyFilters })
          onReset?.()
        }}
        className="text-sm font-semibold text-rose-500"
      >
        Reset all filters
      </button>
    </div>
  )

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="panel sticky top-[calc(var(--nav-h,7.5rem)+1rem)] p-4">
          {body}
        </div>
      </aside>
      <div className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`}>
        <button
          type="button"
          className={`absolute inset-0 bg-fresh-950/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
          aria-label="Close filters"
        />
        <div
          className={`absolute inset-y-0 left-0 w-[min(86vw,320px)] overflow-y-auto bg-[#fffaf2] p-5 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-[#1a1713] ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">Filters</h3>
            <button type="button" onClick={onClose} className="text-sm font-semibold text-fresh-600">
              Done
            </button>
          </div>
          {body}
        </div>
      </div>
    </>
  )
}
