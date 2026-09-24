import { useState } from 'react'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const { push } = useToast()

  return (
    <div className="overflow-hidden bg-[#101820] px-6 py-12 text-[#f7f3ea] sm:px-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="aisle-kicker !text-[#e3a008] justify-center">Classifieds</p>
        <h2 className="text-3xl font-bold">The evening list, in your inbox</h2>
        <p className="mt-2 text-[#efe6d4]/75">Weekly recipes, flash lists and seasonal crates. No spam.</p>
        <form
          className="mt-6 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            if (!email.includes('@')) return push('Enter a valid email', 'error')
            push('You are on the list')
            setEmail('')
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 flex-1 border-0 bg-[#fffaf2] px-4 text-fresh-900 outline-none"
          />
          <Button type="submit" variant="amber" size="lg">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  )
}
