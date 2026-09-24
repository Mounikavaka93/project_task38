import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-fresh-950/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative max-h-[92vh] w-full overflow-y-auto bg-[#fffaf2] shadow-2xl animate-scale-in dark:bg-[#1a1713] ${
          wide ? 'sm:max-w-4xl' : 'sm:max-w-lg'
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ddd2b8] bg-[#fffaf2]/90 px-5 py-4 backdrop-blur dark:border-[#3a342c] dark:bg-[#1a1713]/90">
          <h3 className="text-lg font-bold text-fresh-900 dark:text-fresh-50">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-fresh-700 hover:bg-fresh-100 dark:text-fresh-200 dark:hover:bg-fresh-900"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
