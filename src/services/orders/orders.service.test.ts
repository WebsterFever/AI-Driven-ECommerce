import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  collectionMock,
  docMock,
  getDocsMock,
  orderByMock,
  queryMock,
  runTransactionMock,
  updateDocMock,
  whereMock,
} = vi.hoisted(() => ({
  collectionMock: vi.fn(() => ({ path: 'orders' })),
  docMock: vi.fn((_db, collectionName?: string, id?: string) =>
    id ? { path: `${collectionName}/${id}` } : { path: 'orders/generated-order-id', id: 'generated-order-id' },
  ),
  getDocsMock: vi.fn(),
  orderByMock: vi.fn(() => ({ type: 'orderBy' })),
  queryMock: vi.fn((...args) => args),
  runTransactionMock: vi.fn(),
  updateDocMock: vi.fn(),
  whereMock: vi.fn(() => ({ type: 'where' })),
}))

vi.mock('firebase/firestore', () => ({
  collection: collectionMock,
  doc: docMock,
  getDocs: getDocsMock,
  orderBy: orderByMock,
  query: queryMock,
  runTransaction: runTransactionMock,
  updateDoc: updateDocMock,
  where: whereMock,
}))

vi.mock('../firebase/config', () => ({
  db: {},
}))

import { createOrder, getAllOrders, getUserOrders, updateOrderStatus } from './orders.service'
import type { CartItem, Order } from '../../types'

const item: CartItem = {
  id: 'product-1',
  name: 'iPhone',
  price: 100,
  imageUrl: 'https://example.com/iphone.jpg',
  quantity: 2,
}

describe('orders.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    collectionMock.mockReturnValue({ path: 'orders' })
    docMock.mockImplementation((_db, collectionName?: string, id?: string) =>
      id ? { path: `${collectionName}/${id}` } : { path: 'orders/generated-order-id', id: 'generated-order-id' },
    )
  })

  it('loads orders for one user', async () => {
    const order = { id: 'order-1', userId: 'user-1' } as Order
    getDocsMock.mockResolvedValue({ docs: [{ data: () => order }] })

    const result = await getUserOrders('user-1')

    expect(whereMock).toHaveBeenCalledWith('userId', '==', 'user-1')
    expect(result).toEqual([order])
  })

  it('loads all orders', async () => {
    const order = { id: 'order-1' } as Order
    getDocsMock.mockResolvedValue({ docs: [{ data: () => order }] })

    await expect(getAllOrders()).resolves.toEqual([order])
  })

  it('updates an order status', async () => {
    await updateOrderStatus('order-1', 'processing')

    expect(updateDocMock).toHaveBeenCalledWith(
      expect.objectContaining({ path: 'orders/order-1' }),
      expect.objectContaining({ status: 'processing', updatedAt: expect.any(String) }),
    )
  })

  it('creates the order and decrements stock atomically', async () => {
    const transaction = {
      get: vi.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({ stock: 5 }),
      }),
      update: vi.fn(),
      set: vi.fn(),
    }

    runTransactionMock.mockImplementation(async (_db, callback) => callback(transaction))

    const order = await createOrder('user-1', [item])

    expect(order.userId).toBe('user-1')
    expect(order.status).toBe('pending')
    expect(order.total).toBe(200)
    expect(transaction.update).toHaveBeenCalledWith(
      expect.objectContaining({ path: 'products/product-1' }),
      expect.objectContaining({ stock: 3 }),
    )
    expect(transaction.set).toHaveBeenCalled()
  })

  it('rejects the transaction when stock is insufficient and performs no writes', async () => {
    const transaction = {
      get: vi.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({ stock: 1 }),
      }),
      update: vi.fn(),
      set: vi.fn(),
    }

    runTransactionMock.mockImplementation(async (_db, callback) => callback(transaction))

    await expect(createOrder('user-1', [item])).rejects.toThrow(
      'Insufficient stock for "iPhone". Available: 1.',
    )
    expect(transaction.update).not.toHaveBeenCalled()
    expect(transaction.set).not.toHaveBeenCalled()
  })

  it('rejects the transaction when a product no longer exists', async () => {
    const transaction = {
      get: vi.fn().mockResolvedValue({
        exists: () => false,
        data: () => ({}),
      }),
      update: vi.fn(),
      set: vi.fn(),
    }

    runTransactionMock.mockImplementation(async (_db, callback) => callback(transaction))

    await expect(createOrder('user-1', [item])).rejects.toThrow(
      'Product "iPhone" is no longer available.',
    )
    expect(transaction.update).not.toHaveBeenCalled()
    expect(transaction.set).not.toHaveBeenCalled()
  })
})
