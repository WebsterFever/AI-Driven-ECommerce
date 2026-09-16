import { useEffect, useState } from 'react'
import { getUserOrders } from '../services/orders/orders.service'
import type { Order } from '../types'

export function useOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadOrders() {
      if (!userId) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await getUserOrders(userId)
        if (!cancelled) {
          setOrders(data)
        }
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err)
        if (!cancelled) {
          setError('Não foi possível carregar seus pedidos.')
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
  }, [userId])

  return { orders, loading, error }
}
