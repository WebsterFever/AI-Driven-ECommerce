import { Route, Routes } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminLayout from '../components/layout/AdminLayout'
import AdminProducts from '../pages/admin/AdminProducts'
import ProductEdit from '../pages/admin/ProductEdit'
import ProductNew from '../pages/admin/ProductNew'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Cart from '../pages/cart/Cart'
import Checkout from '../pages/cart/Checkout'
import OrderConfirmation from '../pages/cart/OrderConfirmation'
import Home from '../pages/Home'
import Orders from '../pages/orders/Orders'
import ProductDetail from '../pages/products/ProductDetail'
import { AdminRoute } from './AdminRoute'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/confirmation" element={<OrderConfirmation />} />
        <Route path="/orders" element={<Orders />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductNew />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
        </Route>
      </Route>
    </Routes>
  )
}
