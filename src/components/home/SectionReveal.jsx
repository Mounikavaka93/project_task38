import { useInView } from '../../hooks/useInView'

export default function SectionReveal({ children, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} className={`${className} ${inView ? 'is-revealed animate-fade-up' : 'translate-y-6 opacity-0'}`}>
      {children}
    </section>
  )
}
