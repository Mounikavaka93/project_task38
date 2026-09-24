import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { heroSlides } from '../../data/store'
import Button from '../ui/Button'
import SafeImage from '../ui/SafeImage'

const offers = [
  { label: '40% off the veg crate', to: '/products?category=vegetables' },
  { label: 'Tonight’s flash list', to: '/products?deal=1' },
  { label: 'Free van above ₹499', to: '/products' },
  { label: 'Pantry restock', to: '/products?category=grocery' },
]

export default function HeroBanner() {
  const [i, setI] = useState(0)
  const slide = heroSlides[i]

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % heroSlides.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="border-b border-fresh-200 bg-[#101820] text-[#f7f3ea]">
      <div className="shell grid items-stretch lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center py-12 sm:py-16 lg:py-20 lg:pr-12">
          <p className="aisle-kicker !text-[#e3a008]">Evening edition · Vol. 38</p>
          <div key={slide.id}>
            <span className="inline-block rounded-sm bg-[#e3a008] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1f1b16] animate-fade-up">
              {slide.badge}
            </span>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.28em] text-[#c4b189] animate-fade-up hero-delay-1">
              {slide.kicker}
            </p>
            <h1 className="mt-3 max-w-xl text-3xl font-bold leading-[1.05] animate-fade-up hero-delay-2 sm:text-5xl lg:text-[3.6rem]">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#efe6d4]/80 animate-fade-up hero-delay-3 sm:text-base">
              {slide.subtitle}
            </p>
            <Button as={Link} to={slide.to} variant="amber" size="lg" className="mt-7 animate-fade-up hero-delay-4">
              {slide.cta}
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
            {offers.map((offer) => (
              <Link
                key={offer.label}
                to={offer.to}
                className="rounded-sm border border-[#c4b189]/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#f7f3ea] transition hover:border-[#e3a008] hover:text-[#e3a008]"
              >
                {offer.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="relative min-h-[280px] overflow-hidden border-t border-white/10 lg:min-h-[560px] lg:border-l lg:border-t-0">
          <SafeImage
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/50 to-transparent" />
          <div className="absolute bottom-5 left-5 flex gap-2">
            {heroSlides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-sm transition-all duration-300 ${idx === i ? 'w-8 bg-[#e3a008]' : 'w-4 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
