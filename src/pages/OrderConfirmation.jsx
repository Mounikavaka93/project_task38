import { CheckCircle2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { formatINR } from '../utils/format'
import { readStorage } from '../utils/storage'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

export default function OrderConfirmation() {
  const order = useLocation().state?.order || readStorage('fb-last-order', null)
  if (!order) {
    return (
      <div className="shell py-10">
        <EmptyState title="No order to show" actionTo="/account" actionLabel="View account" />
      </div>
    )
  }

  return (
    <div className="shell py-12 text-center">
      <div className="mx-auto max-w-2xl">
        <CheckCircle2 className="mx-auto text-fresh-600" size={56} />
        <p className="aisle-kicker justify-center">Receipt</p>
        <h1 className="mt-2 text-3xl font-extrabold">Order confirmed</h1>
        <p className="mt-2 text-fresh-700/80 dark:text-fresh-200/70">
          We packed your confirmation. Reference <strong>{order.id}</strong>
        </p>
        <div className="panel mt-8 p-5 text-left">
          {order.items.map((i) => (
            <div key={i.key} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="min-w-0 break-words">
                {i.name} × {i.qty}
              </span>
              <span className="font-semibold">{formatINR(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-fresh-100 pt-3 font-extrabold dark:border-fresh-800">
            <span>Paid</span>
            <span>{formatINR(order.total)}</span>
          </div>
          {order.address && (
            <p className="mt-3 text-sm text-fresh-700 dark:text-fresh-200">
              Delivering to {order.address.line1}, {order.address.city} {order.address.pincode}
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button as={Link} to="/products" variant="outline">
            Continue shopping
          </Button>
          <Button as={Link} to="/account">
            My orders
          </Button>
        </div>
      </div>
    </div>
  )
}
