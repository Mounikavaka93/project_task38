import EmptyState from '../components/ui/EmptyState'

export default function NotFound() {
  return (
    <div className="shell py-16">
      <EmptyState title="Page not found" description="That aisle does not exist. Head back to the shop floor." />
    </div>
  )
}
