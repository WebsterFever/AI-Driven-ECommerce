import { collection, doc, setDoc } from 'firebase/firestore'
import type { CartItem, Order, OrderItem } from '../../types'
import { db } from '../firebase/config'

const ordersCollection = collection(db, 'orders')

export async function createOrder(userId: string, items: CartItem[]): Promise<Order> {
  const orderRef = doc(ordersCollection)
  const now = new Date().toISOString()

  const orderItems: OrderItem[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    imageUrl: item.imageUrl,
    quantity: item.quantity,
  }))

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const order: Order = {
    id: orderRef.id,
    userId,
    items: orderItems,
    total,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  }

  await setDoc(orderRef, order)

  return order
}
