import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const tones = {
  success: 'border-[#ddd2b8] bg-[#fffaf2] text-fresh-800 dark:border-[#3a342c] dark:bg-[#1a1713] dark:text-fresh-100',
  error: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100',
  info: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100',
}

export default function ToastNotification() {
  const { toasts, dismiss } = useToast()
  return (
    <div className="pointer-events-none fixed top-[calc(var(--nav-h,5rem)+0.5rem)] right-3 left-3 z-[100] flex flex-col gap-2 sm:left-auto sm:w-[min(100%-2rem,360px)]">
      {toasts.map((t) => {
        const Icon = icons[t.type] || Info
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto flex items-start gap-3 border px-4 py-3 text-left text-sm shadow-[4px_4px_0_#101820] animate-dropdown ${tones[t.type]}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <span className="font-medium">{t.message}</span>
          </button>
        )
      })}
    </div>
  )
}
