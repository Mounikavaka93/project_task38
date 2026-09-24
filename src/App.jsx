import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { CompareProvider } from './context/CompareContext'
import { RecentlyViewedProvider } from './context/RecentlyViewedContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { UIProvider } from './context/UIContext'
import { WishlistProvider } from './context/WishlistContext'
import Layout from './components/layout/Layout'
import Account from './pages/Account'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Compare from './pages/Compare'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import OrderConfirmation from './pages/OrderConfirmation'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'
import Register from './pages/Register'
import Welcome from './pages/Welcome'
import Wishlist from './pages/Wishlist'

export default function App() {
  const [entered, setEntered] = useState(false)

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <CompareProvider>
                  <UIProvider>
                    <BrowserRouter>
                      {!entered ? (
                        <Welcome onEnter={() => setEntered(true)} />
                      ) : (
                        <Routes>
                          <Route element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="shop" element={<Navigate to="/" replace />} />
                            <Route path="products" element={<Products />} />
                            <Route path="product/:id" element={<ProductDetails />} />
                            <Route path="cart" element={<Cart />} />
                            <Route path="checkout" element={<Checkout />} />
                            <Route path="account" element={<Account />} />
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="wishlist" element={<Wishlist />} />
                            <Route path="compare" element={<Compare />} />
                            <Route path="order-confirmation" element={<OrderConfirmation />} />
                            <Route path="home" element={<Navigate to="/" replace />} />
                            <Route path="*" element={<NotFound />} />
                          </Route>
                        </Routes>
                      )}
                    </BrowserRouter>
                  </UIProvider>
                </CompareProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
