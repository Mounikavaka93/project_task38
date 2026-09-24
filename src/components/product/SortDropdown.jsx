export default function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 border border-[#ddd2b8] bg-[#fffaf2] px-3 text-sm font-medium text-fresh-800 outline-none transition duration-200 focus:border-[#c9841a] dark:border-[#3a342c] dark:bg-[#1a1713] dark:text-fresh-100"
    >
      <option value="popular">Popularity</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Rating</option>
      <option value="newest">Newest</option>
    </select>
  )
}
