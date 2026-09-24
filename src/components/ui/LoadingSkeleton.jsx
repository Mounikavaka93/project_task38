export function ProductCardSkeleton() {
  return (
    <div className="ticket overflow-hidden">
      <div className="skeleton aspect-square w-full" />
      <div className="space-y-2 p-3">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton mt-3 h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="shell space-y-6 py-8">
      <div className="skeleton h-10 w-48 rounded-xl" />
      <div className="skeleton h-64 w-full" />
      <ProductGridSkeleton />
    </div>
  )
}

export default function LoadingSkeleton() {
  return <PageSkeleton />
}
