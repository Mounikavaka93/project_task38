import { useEffect, useState } from 'react'

function placeholderSrc(alt) {
  const text = encodeURIComponent((alt || 'Fresh Choice').slice(0, 28))
  return `https://placehold.co/800x800/2a3d56/f7f3ea/jpg?text=${text}`
}

export default function SafeImage({ src, alt = '', className = '', ...props }) {
  const [current, setCurrent] = useState(src)
  const [step, setStep] = useState('remote')

  useEffect(() => {
    setCurrent(src)
    setStep('remote')
  }, [src])

  if (step === 'empty' || !current) {
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-fresh-100 to-[#ddd0b4] text-fresh-900 dark:from-fresh-900 dark:to-fresh-800 dark:text-fresh-100 ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="px-2 text-center text-xs font-semibold leading-tight">{alt || 'Fresh Choice'}</span>
      </div>
    )
  }

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`bg-fresh-100 object-cover dark:bg-fresh-900 ${className}`}
      onError={() => {
        if (step === 'remote') {
          setStep('placeholder')
          setCurrent(placeholderSrc(alt))
        } else {
          setStep('empty')
        }
      }}
      {...props}
    />
  )
}
