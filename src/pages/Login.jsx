import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const { login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  return (
    <div className="shell mx-auto max-w-md py-12">
      <div className="ticket p-6">
        <p className="aisle-kicker">Member desk</p>
        <h1 className="text-2xl font-extrabold">Welcome back</h1>
        <p className="mt-1 text-sm text-fresh-600">Login to manage orders and addresses.</p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            const res = login(form)
            if (!res.ok) return push(res.error, 'error')
            push('Logged in')
            navigate('/account')
          }}
        >
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          New here?{' '}
          <Link to="/register" className="font-bold text-fresh-600">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
