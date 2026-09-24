import { Link } from 'react-router-dom'
import { categories, products, promoBanners, testimonials } from '../data/store'
import CategoryCard from '../components/product/CategoryCard'
import ProductGrid from '../components/product/ProductGrid'
import HeroBanner from '../components/home/HeroBanner'
import FlashSale from '../components/home/FlashSale'
import Newsletter from '../components/home/Newsletter'
import TrustBar from '../components/home/TrustBar'
import SectionReveal from '../components/home/SectionReveal'
import SafeImage from '../components/ui/SafeImage'
import StarRating from '../components/ui/StarRating'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'

function Head({ aisle, title, to, label = 'Open aisle' }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3 border-b border-fresh-200 pb-3">
      <div>
        {aisle && <p className="aisle-kicker">Aisle {aisle}</p>}
        <h2 className="text-2xl font-bold text-fresh-900 dark:text-fresh-50 sm:text-3xl">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="shrink-0 text-xs font-bold uppercase tracking-[0.16em] text-fresh-600 hover:text-[#c9841a]">
          {label} →
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  const { items: recent } = useRecentlyViewed()
  const featured = products.filter((p) => p.featured).slice(0, 8)
  const best = products.filter((p) => p.bestSeller).slice(0, 8)
  const fresh = products.filter((p) => p.category === 'vegetables' || p.category === 'fruits').slice(0, 8)
  const grocery = products.filter((p) => p.category === 'grocery' || p.grocery).slice(0, 8)
  const recommended = products.filter((p) => p.recommended).slice(0, 8)

  return (
    <div>
      <HeroBanner />

      <div className="shell space-y-16 py-10">
        <TrustBar />

        <SectionReveal>
          <Head aisle="01" title="Shop by category" to="/products" />
          <div className="no-scrollbar -mx-3 flex gap-4 overflow-x-auto px-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </SectionReveal>

        <SectionReveal>
          <Head aisle="02" title="Featured this week" to="/products?tag=featured" />
          <ProductGrid products={featured} />
        </SectionReveal>

        <SectionReveal>
          <Head aisle="03" title="Best sellers" to="/products?tag=bestseller" />
          <ProductGrid products={best} />
        </SectionReveal>

        <SectionReveal>
          <FlashSale />
        </SectionReveal>

        <SectionReveal>
          <Head aisle="04" title="Fresh vegetables & fruits" to="/products?group=produce" />
          <ProductGrid products={fresh} />
        </SectionReveal>

        <SectionReveal>
          <Head aisle="05" title="Grocery essentials" to="/products?tag=grocery" />
          <ProductGrid products={grocery} />
        </SectionReveal>

        <SectionReveal>
          <Head aisle="06" title="Recommended for you" to="/products?tag=recommended" />
          <ProductGrid products={recommended} />
        </SectionReveal>

        {recent.length > 0 && (
          <SectionReveal>
            <Head aisle="07" title="Recently viewed" />
            <ProductGrid products={recent.slice(0, 4)} />
          </SectionReveal>
        )}

        <SectionReveal>
          <Head aisle="08" title="Promotional offers" to="/products?deal=1" label="All deals" />
          <div className="grid gap-4 md:grid-cols-3">
            {promoBanners.map((b) => (
              <Link
                key={b.id}
                to={b.to}
                className="ticket group block min-h-44"
              >
                <div className="relative min-h-44 overflow-hidden">
                  <SafeImage src={b.image} alt={b.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className={`absolute inset-0 bg-gradient-to-tr ${b.tone} opacity-80`} />
                  <div className="relative flex min-h-44 flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold">{b.title}</h3>
                    <p className="text-sm text-white/80">{b.subtitle}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal>
          <Head aisle="09" title="What shoppers say" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <article
                key={t.id}
                className="ticket p-5"
              >
                <div className="flex items-center gap-3">
                  <SafeImage src={t.avatar} alt={t.name} className="h-12 w-12 rounded-sm object-cover" />
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-xs text-fresh-600/70">{t.role}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <StarRating value={t.rating} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-fresh-800/80 dark:text-fresh-100/75">{t.text}</p>
              </article>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal>
          <Newsletter />
        </SectionReveal>
      </div>
    </div>
  )
}
