import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { CartItem, Order, OrderItem, OrderStatus } from '../../types'
import { db } from '../firebase/config'

const ordersCollection = collection(db, 'orders')

export async function getUserOrders(userId: string): Promise<Order[]> {
  const userOrdersQuery = query(
    ordersCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(userOrdersQuery)
  return snapshot.docs.map((document) => document.data() as Order)
}

export async function getAllOrders(): Promise<Order[]> {
  const allOrdersQuery = query(ordersCollection, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(allOrdersQuery)
  return snapshot.docs.map((document) => document.data() as Order)
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(db, 'orders', id), {
    status,
    updatedAt: new Date().toISOString(),
  })
}

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
