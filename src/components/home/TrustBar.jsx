import { Leaf, RefreshCcw, ShieldCheck, Truck } from 'lucide-react'

const items = [
  { icon: Truck, title: 'Same-day slots', text: 'Evening van in metro cities' },
  { icon: Leaf, title: 'Farm-fresh crates', text: 'Sourced daily from partner farms' },
  { icon: RefreshCcw, title: 'Easy replacements', text: 'Not happy? We replace it' },
  { icon: ShieldCheck, title: 'Secure checkout', text: 'UPI, cards, COD and wallets' },
]

export default function TrustBar() {
  return (
    <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, text }, i) => (
        <div
          key={title}
          className="ticket flex items-start gap-3 p-3 transition duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#101820] text-[#e3a008]">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a6f32]">0{i + 1}</p>
            <p className="text-sm font-bold">{title}</p>
            <p className="text-xs text-fresh-600/80 dark:text-fresh-200/70">{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
