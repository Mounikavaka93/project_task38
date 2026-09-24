import Input from '../ui/Input'

export default function CheckoutForm({ form, errors, onChange }) {
  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <h2 className="font-extrabold">Customer information</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Full name" value={form.name} onChange={onChange('name')} error={errors.name} />
          <Input label="Phone" value={form.phone} onChange={onChange('phone')} error={errors.phone} />
          <Input label="Email" className="sm:col-span-2" value={form.email} onChange={onChange('email')} error={errors.email} />
        </div>
      </section>
      <section className="panel p-5">
        <h2 className="font-extrabold">Delivery address</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Street address" className="sm:col-span-2" value={form.line1} onChange={onChange('line1')} error={errors.line1} />
          <Input label="City" value={form.city} onChange={onChange('city')} error={errors.city} />
          <Input label="Pincode" value={form.pincode} onChange={onChange('pincode')} error={errors.pincode} />
        </div>
      </section>
    </div>
  )
}
