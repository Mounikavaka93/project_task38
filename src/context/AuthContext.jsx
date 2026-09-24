import { createContext, useContext, useMemo, useState } from 'react'
import { readStorage, removeStorage, writeStorage } from '../utils/storage'

const AuthContext = createContext(null)

const defaultProfile = {
  name: '',
  email: '',
  phone: '',
  addresses: [],
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage('fb-user', null))
  const [orders, setOrders] = useState(() => readStorage('fb-orders', []))

  const persistUser = (next) => {
    setUser(next)
    if (next) writeStorage('fb-user', next)
    else removeStorage('fb-user')
  }

  const register = ({ name, email, password, phone }) => {
    const next = {
      ...defaultProfile,
      name,
      email,
      phone: phone || '',
      password,
      createdAt: new Date().toISOString(),
    }
    persistUser(next)
    return next
  }

  const login = ({ email, password }) => {
    const stored = readStorage('fb-user', null)
    if (stored && stored.email === email && stored.password === password) {
      persistUser(stored)
      return { ok: true }
    }
    if (email && password) {
      const next = {
        ...defaultProfile,
        name: email.split('@')[0],
        email,
        password,
        createdAt: new Date().toISOString(),
      }
      persistUser(next)
      return { ok: true }
    }
    return { ok: false, error: 'Enter a valid email and password.' }
  }

  const logout = () => persistUser(null)

  const updateProfile = (patch) => {
    if (!user) return
    persistUser({ ...user, ...patch })
  }

  const saveAddress = (address) => {
    if (!user) return
    const addresses = [...(user.addresses || [])]
    const idx = addresses.findIndex((a) => a.id === address.id)
    if (idx >= 0) addresses[idx] = address
    else addresses.push({ ...address, id: address.id || crypto.randomUUID?.() || String(Date.now()) })
    persistUser({ ...user, addresses })
  }

  const removeAddress = (id) => {
    if (!user) return
    persistUser({ ...user, addresses: (user.addresses || []).filter((a) => a.id !== id) })
  }

  const addOrder = (order) => {
    const next = [order, ...orders]
    setOrders(next)
    writeStorage('fb-orders', next)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthed: Boolean(user),
      orders,
      register,
      login,
      logout,
      updateProfile,
      saveAddress,
      removeAddress,
      addOrder,
    }),
    [user, orders],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
