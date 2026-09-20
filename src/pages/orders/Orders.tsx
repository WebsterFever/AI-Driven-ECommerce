import { Link } from 'react-router-dom'
import { useOrdersContext } from '../../contexts/OrdersContext'
import type { OrderStatus } from '../../types'

const STATUS_LABELS: Record<OrderStatus, string> = { pending: 'Pending', processing: 'Processing', completed: 'Completed', cancelled: 'Cancelled' }
const STATUS_STYLES: Record<OrderStatus, string> = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }

function Orders() {
  const { orders, loading, error } = useOrdersContext()
  return <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
    <h1 className="mb-6 text-2xl font-bold text-slate-900">My Orders</h1>
    {loading && <p className="text-sm text-slate-500">Loading...</p>}
    {!loading && error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
    {!loading && !error && orders.length === 0 && <div className="rounded-lg bg-white p-8 text-center shadow-sm"><p className="text-sm text-slate-500">You haven't placed any orders yet.</p><Link to="/" className="mt-3 inline-block font-medium text-blue-600 hover:underline">View catalog</Link></div>}
    {!loading && !error && orders.length > 0 && <div className="flex flex-col gap-4">{orders.map((order) => {
      const formattedTotal = order.total.toLocaleString('en-US', { style: 'currency', currency: 'BRL' })
      const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US')
      return <div key={order.id} className="rounded-lg border border-slate-200 bg-white p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs text-slate-400">Order #{order.id.slice(0, 8)}</p><p className="text-xs text-slate-400">{formattedDate}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>{STATUS_LABELS[order.status]}</span></div><div className="flex flex-col gap-2">{order.items.map((item) => <div key={item.id} className="flex items-center gap-3 text-sm"><img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded object-cover" /><span className="flex-1 text-slate-700">{item.name}</span><span className="text-slate-500">x{item.quantity}</span></div>)}</div><p className="mt-3 text-right text-sm font-bold text-slate-900">Total: {formattedTotal}</p></div>
    })}</div>}
  </div>
}

export default Orders
