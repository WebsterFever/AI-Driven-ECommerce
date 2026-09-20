import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  collectionMock,
  deleteDocMock,
  docMock,
  getDocMock,
  getDocsMock,
  queryMock,
  setDocMock,
  updateDocMock,
  whereMock,
} = vi.hoisted(() => ({
  collectionMock: vi.fn(() => ({ path: 'products' })),
  deleteDocMock: vi.fn(),
  docMock: vi.fn((_arg1, arg2?: string, arg3?: string) => {
    if (typeof arg2 === 'undefined') {
      return { path: 'products/generated-product-id', id: 'generated-product-id' }
    }
    if (typeof arg3 === 'undefined') {
      return { path: `products/${arg2}`, id: arg2 }
    }
    return { path: `${arg2}/${arg3}`, id: arg3 }
  }),
  getDocMock: vi.fn(),
  getDocsMock: vi.fn(),
  queryMock: vi.fn((...args) => args),
  setDocMock: vi.fn(),
  updateDocMock: vi.fn(),
  whereMock: vi.fn(() => ({ type: 'where' })),
}))

vi.mock('firebase/firestore', () => ({
  collection: collectionMock,
  deleteDoc: deleteDocMock,
  doc: docMock,
  getDoc: getDocMock,
  getDocs: getDocsMock,
  query: queryMock,
  setDoc: setDocMock,
  updateDoc: updateDocMock,
  where: whereMock,
}))

vi.mock('../firebase/config', () => ({
  db: {},
}))

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
} from './products.service'
import type { Product } from '../../types'

const product: Product = {
  id: 'product-1',
  name: 'iPhone',
  description: 'Phone',
  price: 100,
  category: 'electronics',
  imageUrl: 'https://example.com/iphone.jpg',
  stock: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const input = {
  name: product.name,
  description: product.description,
  price: product.price,
  category: product.category,
  imageUrl: product.imageUrl,
  stock: product.stock,
}

describe('products.service', () => {
  beforeEach(() => vi.clearAllMocks())

  it('loads all products', async () => {
    getDocsMock.mockResolvedValue({ docs: [{ data: () => product }] })
    await expect(getAllProducts()).resolves.toEqual([product])
  })

  it('returns one product by id', async () => {
    getDocMock.mockResolvedValue({ exists: () => true, data: () => product })
    await expect(getProductById('product-1')).resolves.toEqual(product)
  })

  it('returns null when a product does not exist', async () => {
    getDocMock.mockResolvedValue({ exists: () => false })
    await expect(getProductById('missing')).resolves.toBeNull()
  })

  it('filters products by category', async () => {
    getDocsMock.mockResolvedValue({ docs: [{ data: () => product }] })

    await expect(getProductsByCategory('electronics')).resolves.toEqual([product])
    expect(whereMock).toHaveBeenCalledWith('category', '==', 'electronics')
  })

  it('creates a product with generated id and timestamps', async () => {
    const created = await createProduct(input)

    expect(created.id).toBe('generated-product-id')
    expect(created.createdAt).toEqual(expect.any(String))
    expect(created.updatedAt).toEqual(expect.any(String))
    expect(setDocMock).toHaveBeenCalled()
  })

  it('updates a product', async () => {
    await updateProduct('product-1', input)

    expect(updateDocMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'product-1' }),
      expect.objectContaining({ ...input, updatedAt: expect.any(String) }),
    )
  })

  it('deletes a product', async () => {
    await deleteProduct('product-1')
    expect(deleteDocMock).toHaveBeenCalledWith(expect.objectContaining({ id: 'product-1' }))
  })
})
