import { formatINR } from '../../utils/format'
import { FREE_DELIVERY_MIN } from '../../data/store'
import { useCart } from '../../context/CartContext'

export default function OrderSummary({ sticky = false }) {
  const { items, subtotal, productDiscount, couponDiscount, deliveryFee, grandTotal, coupon, pincode } = useCart()
  const mrp = subtotal + productDiscount
  const needForFree = Math.max(0, FREE_DELIVERY_MIN - subtotal)

  return (
    <div
      className={`ticket p-5 ${
        sticky ? 'lg:sticky lg:top-[calc(var(--nav-h,7.5rem)+1rem)]' : ''
      }`}
    >
      <h3 className="text-lg font-extrabold">Order summary</h3>
      <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto text-sm">
        {items.map((i) => (
          <li key={i.key} className="flex justify-between gap-3">
            <span className="truncate">
              {i.product.name} × {i.quantity}
            </span>
            <span className="shrink-0 font-semibold">{formatINR(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Item total (MRP)</dt>
          <dd>{formatINR(mrp)}</dd>
        </div>
        {productDiscount > 0 && (
          <div className="flex justify-between text-fresh-600">
            <dt>Product discount</dt>
            <dd>-{formatINR(productDiscount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Price after discount</dt>
          <dd>{formatINR(subtotal)}</dd>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-fresh-600">
            <dt>Coupon {coupon?.code}</dt>
            <dd>-{formatINR(couponDiscount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Delivery charges</dt>
          <dd>{deliveryFee === 0 ? 'Free' : formatINR(deliveryFee)}</dd>
        </div>
      </dl>
      {deliveryFee > 0 && needForFree > 0 && (
        <p className="mt-3 text-xs text-fresh-600">
          Add {formatINR(needForFree)} more for free delivery (above {formatINR(FREE_DELIVERY_MIN)}).
        </p>
      )}
      {!pincode && (
        <p className="mt-3 text-xs text-fresh-600">Add a pincode on a product page for exact delivery charges.</p>
      )}
      <div className="mt-4 flex justify-between border-t border-fresh-100 pt-3 text-base font-extrabold dark:border-fresh-800">
        <span>Grand total</span>
        <span>{formatINR(grandTotal)}</span>
      </div>
    </div>
  )
}
