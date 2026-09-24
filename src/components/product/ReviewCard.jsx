import StarRating from '../ui/StarRating'

export default function ReviewCard({ review }) {
  return (
    <article className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-fresh-100 text-sm font-bold text-fresh-800 dark:bg-fresh-900 dark:text-fresh-100">
            {review.name.slice(0, 1)}
          </div>
          <div>
            <p className="text-sm font-bold">{review.name}</p>
            <p className="text-xs text-fresh-600/70">{review.date}</p>
          </div>
        </div>
        <StarRating value={review.rating} />
      </div>
      <p className="mt-3 text-sm text-fresh-800/80 dark:text-fresh-100/80">{review.comment}</p>
    </article>
  )
}
