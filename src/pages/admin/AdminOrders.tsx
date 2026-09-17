import { useState } from 'react'
import { useAllOrders } from '../../hooks/useAllOrders'
import { updateOrderStatus } from '../../services/orders/orders.service'
import type { OrderStatus } from '../../types'

const STATUS_LABELS: Record<OrderStatus, string> = { pending: 'Pending', processing: 'Processing', completed: 'Completed', cancelled: 'Cancelled' }
const STATUS_STYLES: Record<OrderStatus, string> = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }
const ALL_STATUSES: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled']
type StatusFilterValue = OrderStatus | 'all'
const STATUS_FILTERS: { value: StatusFilterValue; label: string }[] = [{ value: 'all', label: 'All' }, ...ALL_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }))]

function AdminOrders() {
  const { orders, loading, error } = useAllOrders()
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const filteredOrders = orders.filter((order) => statusFilter === 'all' || order.status === statusFilter)

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId)
    try { await updateOrderStatus(orderId, newStatus); window.location.reload() }
    catch (err) { console.error('Error updating status:', err); window.alert('Unable to update the status.'); setUpdatingId(null) }
  }

  return <div>
    <h1 className="mb-6 text-2xl font-bold text-slate-900">Orders</h1>
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">{STATUS_FILTERS.map((filter) => <button key={filter.value} type="button" onClick={() => setStatusFilter(filter.value)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${statusFilter === filter.value ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>{filter.label}</button>)}</div>
    {loading && <p className="text-sm text-slate-500">Loading...</p>}{!loading && error && <p className="text-sm text-red-600">{error}</p>}{!loading && !error && filteredOrders.length === 0 && <p className="text-sm text-slate-500">No orders found.</p>}
    {!loading && !error && filteredOrders.length > 0 && <div className="flex flex-col gap-4">{filteredOrders.map((order) => {
      const formattedTotal = order.total.toLocaleString('en-US', { style: 'currency', currency: 'BRL' })
      const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US')
      return <div key={order.id} className="rounded-lg border border-slate-200 bg-white p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs text-slate-400">Order #{order.id.slice(0, 8)}</p><p className="text-xs text-slate-400">{formattedDate} · customer: {order.userId.slice(0, 8)}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>{STATUS_LABELS[order.status]}</span></div><div className="flex flex-col gap-2">{order.items.map((item) => <div key={item.id} className="flex items-center gap-3 text-sm"><img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded object-cover" /><span className="flex-1 text-slate-700">{item.name}</span><span className="text-slate-500">x{item.quantity}</span></div>)}</div><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><label className="flex items-center gap-2 text-sm text-slate-600">Change status:<select value={order.status} disabled={updatingId === order.id} onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)} className="rounded-lg border border-slate-300 px-2 py-1 text-sm">{ALL_STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select></label><p className="text-sm font-bold text-slate-900">Total: {formattedTotal}</p></div></div>
    })}</div>}
  </div>
}

export default AdminOrders
