import { useCallback, useEffect, useState } from 'react'
import { getAllOrders } from '../services/orders/orders.service'
import type { Order } from '../types'

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reloadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getAllOrders()
      setOrders(data)
    } catch (err) {
      console.error('Error loading orders:', err)
      setError('Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reloadOrders()
  }, [reloadOrders])

  return { orders, loading, error, reloadOrders }
}
