import { useEffect, useMemo, useRef, useState } from 'react'
import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PRICE_CEILING, categories, products as allProducts } from '../data/store'
import FilterSidebar from '../components/product/FilterSidebar'
import ProductGrid from '../components/product/ProductGrid'
import SortDropdown from '../components/product/SortDropdown'
import EmptyState from '../components/ui/EmptyState'
import { ProductGridSkeleton } from '../components/ui/LoadingSkeleton'

const PAGE = 8

const defaultFilters = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: PRICE_CEILING,
  minRating: 0,
}

export default function Products() {
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase()
  const categoryParam = params.get('category')
  const dealParam = params.get('deal')
  const tag = params.get('tag')
  const group = params.get('group')

  const [filters, setFilters] = useState({
    ...defaultFilters,
    categories: categoryParam ? [categoryParam] : [],
  })
  const [sort, setSort] = useState('popular')
  const [layout, setLayout] = useState('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [visible, setVisible] = useState(PAGE)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchDraft, setSearchDraft] = useState(params.get('q') || '')
  const sentinelRef = useRef(null)

  useEffect(() => {
    setSearchDraft(params.get('q') || '')
  }, [params])

  useEffect(() => {
    setLoading(true)
    const id = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(id)
  }, [q, categoryParam, tag, group, dealParam, filters, sort])

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      categories: categoryParam ? [categoryParam] : f.categories,
    }))
    setVisible(PAGE)
  }, [categoryParam, q, dealParam, tag, group])

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.includes(q) ||
        p.description.toLowerCase().includes(q)
      const matchCat = !filters.categories.length || filters.categories.includes(p.category)
      const matchBrand = !filters.brands.length || filters.brands.includes(p.brand)
      const matchPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice
      const matchRating = p.rating >= filters.minRating
      const matchDeal = !dealParam || p.deal || p.flashSale
      const matchTag =
        !tag ||
        (tag === 'featured' && p.featured) ||
        (tag === 'bestseller' && p.bestSeller) ||
        (tag === 'recommended' && p.recommended) ||
        (tag === 'grocery' && (p.grocery || p.category === 'grocery'))
      const matchGroup = !group || (group === 'produce' && (p.category === 'vegetables' || p.category === 'fruits'))
      return matchQ && matchCat && matchBrand && matchPrice && matchRating && matchDeal && matchTag && matchGroup
    })

    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'newest') return Number(b.isNew) - Number(a.isNew) || b.reviewsCount - a.reviewsCount
      return b.sold - a.sold
    })
    return list
  }, [q, filters, sort, dealParam, tag, group])

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    window.setTimeout(() => {
      setVisible((n) => n + PAGE)
      setLoadingMore(false)
    }, 280)
  }

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || loading || !hasMore) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore()
      },
      { rootMargin: '240px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, loadingMore, shown.length])

  const heading = q
    ? `Results for “${q}”`
    : dealParam
      ? "Today's deals"
      : tag === 'featured'
        ? 'Featured products'
        : tag === 'bestseller'
          ? 'Best sellers'
          : tag === 'recommended'
            ? 'Recommended for you'
            : tag === 'grocery'
              ? 'Grocery essentials'
              : group === 'produce'
                ? 'Fresh vegetables & fruits'
                : 'All products'

  const runSearch = (e) => {
    e.preventDefault()
    const next = new URLSearchParams(params)
    if (searchDraft.trim()) next.set('q', searchDraft.trim())
    else next.delete('q')
    setParams(next)
  }

  const resetListing = () => {
    setFilters({ ...defaultFilters })
    setParams({})
    setSearchDraft('')
  }

  const chips = [
    ...filters.categories.map((id) => ({
      key: `c-${id}`,
      label: categories.find((c) => c.id === id)?.name || id,
      clear: () => setFilters((f) => ({ ...f, categories: f.categories.filter((c) => c !== id) })),
    })),
    ...filters.brands.map((b) => ({
      key: `b-${b}`,
      label: b,
      clear: () => setFilters((f) => ({ ...f, brands: f.brands.filter((x) => x !== b) })),
    })),
    ...(filters.minRating ? [{ key: 'rating', label: `${filters.minRating}★ & up`, clear: () => setFilters((f) => ({ ...f, minRating: 0 })) }] : []),
    ...(filters.minPrice > 0 || filters.maxPrice < PRICE_CEILING
      ? [{ key: 'price', label: `₹${filters.minPrice}–₹${filters.maxPrice}`, clear: () => setFilters((f) => ({ ...f, minPrice: 0, maxPrice: PRICE_CEILING })) }]
      : []),
  ]

  return (
    <div className="shell py-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="aisle-kicker">The floor</p>
          <h1 className="text-2xl font-extrabold break-words sm:text-3xl">{heading}</h1>
          <p className="mt-1 text-sm text-fresh-700/70">
            Showing {shown.length} of {filtered.length} items
          </p>
        </div>
        <form onSubmit={runSearch} className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fresh-500" size={16} />
          <input
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Search on this page..."
            className="h-11 w-full border border-[#ddd2b8] bg-[#fffaf2] pl-9 pr-20 text-sm outline-none focus:border-[#c9841a] dark:border-[#3a342c] dark:bg-[#1a1713]"
          />
          <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-fresh-600 px-3 py-1.5 text-xs font-bold text-white">
            Search
          </button>
        </form>
      </div>
      {chips.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="border border-[#ddd2b8] bg-[#fffaf2] px-3 py-1 text-xs font-semibold text-fresh-800 dark:border-[#3a342c] dark:bg-[#1a1713] dark:text-fresh-100"
            >
              {chip.label} ×
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-6">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onReset={resetListing}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-[#ddd2b8] bg-[#fffaf2] px-3 py-2 text-sm font-semibold lg:hidden dark:border-[#3a342c] dark:bg-[#1a1713]"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex border border-[#ddd2b8] p-1 dark:border-[#3a342c]">
                <button
                  type="button"
                  onClick={() => setLayout('grid')}
                  className={`p-1.5 ${layout === 'grid' ? 'bg-[#e3a008] text-[#1f1b16]' : ''}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('list')}
                  className={`p-1.5 ${layout === 'list' ? 'bg-[#e3a008] text-[#1f1b16]' : ''}`}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </div>
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : shown.length === 0 ? (
            <EmptyState title="No matches" description="Try clearing filters or searching a different aisle." />
          ) : (
            <>
              <ProductGrid products={shown} layout={layout} />
              {hasMore && (
                <div ref={sentinelRef} className="mt-8 flex flex-col items-center gap-3">
                  {loadingMore && <ProductGridSkeleton count={4} />}
                  <button
                    type="button"
                    onClick={loadMore}
                    className="bg-fresh-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-fresh-700"
                  >
                    Load more products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
