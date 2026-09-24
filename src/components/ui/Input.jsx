export default function Input({ label, hint, error, className = '', id, ...props }) {
  const inputId = id || props.name
  return (
    <label className={`block ${className}`} htmlFor={inputId}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-fresh-900 dark:text-fresh-100">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={`w-full border bg-[#fffaf2] px-3.5 py-2.5 text-sm text-fresh-900 outline-none transition focus:border-[#c9841a] focus:ring-2 focus:ring-[#c9841a]/20 dark:bg-[#1a1713] dark:text-fresh-50 ${
          error ? 'border-rose-400' : 'border-[#ddd2b8] dark:border-[#3a342c]'
        }`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
      {hint && !error && <span className="mt-1 block text-xs text-fresh-600/70 dark:text-fresh-300/70">{hint}</span>}
    </label>
  )
}
