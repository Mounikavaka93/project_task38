import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/store'
import SafeImage from '../ui/SafeImage'

export default function MegaMenu() {
  const [active, setActive] = useState(null)

  return (
    <div className="relative hidden border-t border-fresh-200 bg-[#fffaf2] dark:border-[#3a342c] dark:bg-[#12100d] lg:block">
      <div className="shell no-scrollbar flex items-center gap-1 overflow-x-auto">
        {categories.map((c, index) => (
          <div
            key={c.id}
            className="relative shrink-0"
            onMouseEnter={() => setActive(c.id)}
            onMouseLeave={() => setActive(null)}
          >
            <Link
              to={`/products?category=${c.id}`}
              className={`block whitespace-nowrap px-3 py-3 text-xs font-bold uppercase tracking-[0.14em] transition duration-200 ${
                active === c.id
                  ? 'text-[#c9841a]'
                  : 'text-fresh-800 hover:text-[#c9841a] dark:text-fresh-100'
              }`}
            >
              {c.name}
            </Link>
            {active === c.id && (
              <div className={`absolute top-full z-40 w-[min(420px,calc(100vw-2rem))] ticket p-4 animate-dropdown ${index > 6 ? 'right-0' : 'left-0'}`}>
                <div className="flex gap-4">
                  <SafeImage src={c.image} alt={c.name} className="h-28 w-28 object-cover" />
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <ul className="mt-2 space-y-1">
                      {c.sub.map((s) => (
                        <li key={s}>
                          <Link
                            to={`/products?category=${c.id}&q=${encodeURIComponent(s)}`}
                            className="text-sm text-fresh-700 hover:text-[#c9841a] dark:text-fresh-200"
                          >
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/products?category=${c.id}`}
                      className="mt-3 inline-block text-sm font-bold text-[#c9841a]"
                    >
                      Shop all →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
