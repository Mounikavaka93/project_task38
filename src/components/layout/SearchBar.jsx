import { useEffect, useMemo, useRef, useState } from 'react'
import { Clock3, Search, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { categories, products } from '../../data/store'
import { formatINR } from '../../utils/format'
import { readStorage, writeStorage } from '../../utils/storage'
import SafeImage from '../ui/SafeImage'

const POPULAR = ['Tomatoes', 'Milk', 'Atta', 'Mango', 'Paneer', 'Rice']

function highlight(text, query) {
  if (!query) return text
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-amber-200 text-inherit dark:bg-amber-700">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  )
}

export default function SearchBar({ compact = false }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [recent, setRecent] = useState(() => readStorage('fb-search-recent', []))
  const wrap = useRef(null)
  const navigate = useNavigate()
  const query = q.trim()

  const productHits = useMemo(() => {
    if (query.length < 1) return []
    const n = query.toLowerCase()
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(n) ||
          p.brand.toLowerCase().includes(n) ||
          p.category.includes(n) ||
          p.description.toLowerCase().includes(n),
      )
      .slice(0, 5)
  }, [query])

  const categoryHits = useMemo(() => {
    if (query.length < 1) return []
    const n = query.toLowerCase()
    return categories.filter((c) => c.name.toLowerCase().includes(n) || c.id.includes(n)).slice(0, 3)
  }, [query])

  const brandHits = useMemo(() => {
    if (query.length < 1) return []
    const n = query.toLowerCase()
    return [...new Set(products.map((p) => p.brand))].filter((b) => b.toLowerCase().includes(n)).slice(0, 3)
  }, [query])

  const rows = useMemo(() => {
    if (!query) {
      return [
        ...recent.map((term) => ({ type: 'recent', key: `r-${term}`, term })),
        ...POPULAR.filter((term) => !recent.includes(term)).map((term) => ({
          type: 'popular',
          key: `p-${term}`,
          term,
        })),
      ]
    }
    return [
      ...categoryHits.map((c) => ({ type: 'category', key: `c-${c.id}`, category: c })),
      ...brandHits.map((b) => ({ type: 'brand', key: `b-${b}`, brand: b })),
      ...productHits.map((p) => ({ type: 'product', key: `pr-${p.id}`, product: p })),
    ]
  }, [query, recent, categoryHits, brandHits, productHits])

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    setActive(-1)
  }, [q])

  const remember = (term) => {
    const next = [term, ...recent.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 5)
    setRecent(next)
    writeStorage('fb-search-recent', next)
  }

  const run = (term) => {
    remember(term)
    navigate(`/products?q=${encodeURIComponent(term)}`)
    setOpen(false)
  }

  const activate = (row) => {
    if (!row) return
    if (row.type === 'product') {
      remember(row.product.name)
      navigate(`/product/${row.product.id}`)
      setQ('')
      setOpen(false)
      return
    }
    if (row.type === 'category') {
      navigate(`/products?category=${row.category.id}`)
      setOpen(false)
      return
    }
    if (row.type === 'brand') {
      run(row.brand)
      return
    }
    run(row.term)
  }

  const go = (e) => {
    e?.preventDefault()
    if (active >= 0 && rows[active]) return activate(rows[active])
    if (!query) return
    run(query)
    setQ('')
  }

  const onKey = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(rows.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <form onSubmit={go} ref={wrap} className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fresh-500" size={18} />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder="Search tomatoes, milk, atta..."
        className={`${compact ? 'h-10 pr-20' : 'h-11 pr-24'} w-full min-w-0 border border-[#ddd2b8] bg-[#fffaf2] pl-10 text-sm outline-none focus:border-[#c9841a] focus:ring-2 focus:ring-[#c9841a]/20 dark:border-[#3a342c] dark:bg-[#1a1713] dark:text-fresh-50`}
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-fresh-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-fresh-700"
      >
        Search
      </button>
      {open && (
        <div className="absolute z-50 mt-2 max-h-[70vh] w-full overflow-y-auto ticket animate-dropdown">
          {rows.length === 0 && query && (
            <p className="px-3 py-4 text-sm text-fresh-600">No matches for “{query}”</p>
          )}
          {!query && recent.length > 0 && (
            <p className="px-3 pt-3 text-[11px] font-bold uppercase tracking-wide text-fresh-500">Recent</p>
          )}
          {rows.map((row, i) => {
            const selected = i === active
            const base = `flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
              selected ? 'bg-fresh-100 dark:bg-fresh-900' : 'hover:bg-fresh-50 dark:hover:bg-fresh-900/50'
            }`
            if (row.type === 'product') {
              const p = row.product
              return (
                <button key={row.key} type="button" className={base} onClick={() => activate(row)}>
                  <SafeImage src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{highlight(p.name, query)}</p>
                    <p className="text-xs text-fresh-600/70">{p.brand}</p>
                  </div>
                  <span className="text-sm font-bold">{formatINR(p.price)}</span>
                </button>
              )
            }
            if (row.type === 'category') {
              return (
                <button key={row.key} type="button" className={base} onClick={() => activate(row)}>
                  <Tag size={16} className="text-fresh-600" />
                  <span className="text-sm font-semibold">Category · {highlight(row.category.name, query)}</span>
                </button>
              )
            }
            if (row.type === 'brand') {
              return (
                <button key={row.key} type="button" className={base} onClick={() => activate(row)}>
                  <Search size={16} className="text-fresh-600" />
                  <span className="text-sm font-semibold">Brand · {highlight(row.brand, query)}</span>
                </button>
              )
            }
            return (
              <button key={row.key} type="button" className={base} onClick={() => activate(row)}>
                {row.type === 'recent' ? <Clock3 size={16} className="text-fresh-500" /> : <Search size={16} className="text-fresh-500" />}
                <span className="text-sm">{row.term}</span>
              </button>
            )
          })}
        </div>
      )}
    </form>
  )
}
