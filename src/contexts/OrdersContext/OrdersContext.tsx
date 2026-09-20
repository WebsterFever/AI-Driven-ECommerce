import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '../AuthContext'
import { getAllOrders, getUserOrders, updateOrderStatus } from '../../services/orders/orders.service'
import type { Order, OrderStatus } from '../../types'

interface OrdersContextValue {
  orders: Order[]
  loading: boolean
  error: string | null
  reloadOrders: () => Promise<void>
  changeOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
}

export const OrdersContext = createContext<OrdersContextValue | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user, loadingUser, loadingRole } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reloadOrders = useCallback(async () => {
    if (loadingUser || loadingRole) return

    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = user.role === 'admin'
        ? await getAllOrders()
        : await getUserOrders(user.uid)
      setOrders(data)
    } catch (err) {
      console.error('Error loading orders:', err)
      setError('Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }, [user, loadingUser, loadingRole])

  useEffect(() => {
    void reloadOrders()
  }, [reloadOrders])

  const changeOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status)
    await reloadOrders()
  }, [reloadOrders])

  return (
    <OrdersContext.Provider value={{ orders, loading, error, reloadOrders, changeOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  )
}
