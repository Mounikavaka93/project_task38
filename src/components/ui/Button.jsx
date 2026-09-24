const variants = {
  primary:
    'bg-fresh-600 text-white hover:bg-fresh-700 dark:bg-[#e3a008] dark:hover:bg-[#f0b42a] dark:text-[#1f1b16]',
  secondary:
    'bg-fresh-100 text-fresh-800 hover:bg-fresh-200 dark:bg-fresh-900/60 dark:text-fresh-100 dark:hover:bg-fresh-800',
  outline:
    'border border-fresh-300 text-fresh-800 hover:bg-fresh-50 dark:border-fresh-700 dark:text-fresh-100 dark:hover:bg-fresh-900',
  ghost: 'text-fresh-800 hover:bg-fresh-100 dark:text-fresh-100 dark:hover:bg-fresh-900',
  danger: 'bg-[#b5481d] text-white hover:bg-[#933916]',
  amber: 'bg-[#e3a008] text-[#1f1b16] hover:bg-[#f0b42a] font-semibold',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-10 w-10 p-0',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-wide transition duration-200 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
