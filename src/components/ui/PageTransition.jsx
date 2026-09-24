import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }) {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.search])

  return (
    <div key={location.pathname + location.search} className="animate-page-enter">
      {children}
    </div>
  )
}
