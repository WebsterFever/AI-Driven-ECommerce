import { Link, Navigate, useLocation } from 'react-router-dom'
import type { Order } from '../../types'

function OrderConfirmation() {
  const location = useLocation()
  const order = (location.state as { order?: Order } | null)?.order

  if (!order) {
    return <Navigate to="/" replace />
  }

  const formattedTotal = order.total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Pedido realizado com sucesso!</h1>
      <p className="text-sm text-slate-500">Número do pedido: {order.id}</p>
      <p className="text-sm text-slate-500">Status: {order.status}</p>
      <p className="text-lg font-bold text-blue-600">{formattedTotal}</p>
      <Link to="/" className="mt-4 font-medium text-blue-600 hover:underline">
        Voltar ao catálogo
      </Link>
    </div>
  )
}

export default OrderConfirmation
