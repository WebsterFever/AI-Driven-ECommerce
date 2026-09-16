import { useEffect, useState } from 'react'
import { getAllOrders } from '../services/orders/orders.service'
import type { Order } from '../types'

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadOrders() {
      setLoading(true)
      setError(null)

      try {
        const data = await getAllOrders()
        if (!cancelled) {
          setOrders(data)
        }
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err)
        if (!cancelled) {
          setError('Não foi possível carregar os pedidos.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      cancelled = true
    }
  }, [])

  return { orders, loading, error }
}
