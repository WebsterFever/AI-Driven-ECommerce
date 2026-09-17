import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { createOrder } from '../../services/orders/orders.service'

function Checkout() {
  const { user } = useAuth()
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formattedTotal = total.toLocaleString('en-US', { style: 'currency', currency: 'BRL' })

  async function handleConfirm() {
    if (!user) return
    setLoading(true); setError(null)
    try {
      const order = await createOrder(user.uid, items)
      clearCart()
      navigate('/checkout/confirmation', { state: { order } })
    } catch (err) {
      console.error('Error creating order:', err)
      setError('Unable to complete your order. Please try again.')
    } finally { setLoading(false) }
  }

  if (items.length === 0) return <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center"><h1 className="text-xl font-bold text-slate-900">Your cart is empty</h1><Link to="/" className="font-medium text-blue-600 hover:underline">View catalog</Link></div>

  return <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
    <h1 className="mb-6 text-2xl font-bold text-slate-900">Review Order</h1>
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
    <div className="flex flex-col gap-3">{items.map((item) => {
      const formattedPrice = item.price.toLocaleString('en-US', { style: 'currency', currency: 'BRL' })
      return <div key={item.id} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4"><img src={item.imageUrl} alt={item.name} className="h-14 w-14 rounded object-cover" /><div className="flex-1"><p className="text-sm font-semibold text-slate-900">{item.name}</p><p className="text-xs text-slate-500">{item.quantity}x {formattedPrice}</p></div></div>
    })}</div>
    <div className="mt-6 flex flex-col items-end gap-4 border-t border-slate-200 pt-4"><p className="text-lg font-bold text-slate-900">Total: {formattedTotal}</p><button type="button" onClick={handleConfirm} disabled={loading} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Processing...' : 'Confirm Order'}</button></div>
  </div>
}

export default Checkout
