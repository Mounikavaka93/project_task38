const styles = {
  sale: 'bg-[#b5481d] text-white',
  bestseller: 'bg-[#e3a008] text-[#1f1b16]',
  new: 'bg-[#2a3d56] text-white',
  deal: 'bg-[#1f1b16] text-[#f7f3ea]',
}

const labels = {
  sale: 'Sale',
  bestseller: 'Best Seller',
  new: 'New',
  deal: 'Deal',
}

export default function Badge({ type }) {
  if (!styles[type]) return null
  return (
    <span className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${styles[type]}`}>
      {labels[type]}
    </span>
  )
}
