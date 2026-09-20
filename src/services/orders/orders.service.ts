import {
  collection,
  doc,
  type DocumentData,
  type DocumentSnapshot,
  getDocs,
  orderBy,
  query,
  runTransaction,
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
  const productRefs = items.map((item) => doc(db, 'products', item.id))

  return runTransaction(db, async (transaction) => {
    // All reads must happen before any writes inside a Firestore transaction.
    const productSnaps: DocumentSnapshot<DocumentData>[] = []
    for (const productRef of productRefs) {
      productSnaps.push(await transaction.get(productRef))
    }

    items.forEach((item, index) => {
      const snapshot = productSnaps[index]
      if (!snapshot.exists()) {
        throw new Error(`Product "${item.name}" is no longer available.`)
      }
      const currentStock = snapshot.data().stock as number
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for "${item.name}". Available: ${currentStock}.`)
      }
    })

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

    items.forEach((item, index) => {
      const currentStock = productSnaps[index].data()!.stock as number
      transaction.update(productRefs[index], {
        stock: currentStock - item.quantity,
        updatedAt: now,
      })
    })

    transaction.set(orderRef, order)

    return order
  })
}
