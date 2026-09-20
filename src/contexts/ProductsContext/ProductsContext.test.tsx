import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getAllProducts } from '../../services/products/products.service'
import type { Product } from '../../types'
import { ProductsProvider } from './ProductsContext'
import { useProductsContext } from './useProductsContext'

vi.mock('../../services/products/products.service', () => ({
  getAllProducts: vi.fn(),
}))

const product: Product = {
  id: 'product-1',
  name: 'Test Product',
  description: 'Test description',
  price: 100,
  category: 'electronics',
  imageUrl: 'https://example.com/product.jpg',
  stock: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function wrapper({ children }: { children: ReactNode }) {
  return <ProductsProvider>{children}</ProductsProvider>
}

describe('ProductsContext', () => {
  beforeEach(() => vi.clearAllMocks())

  it('loads products from the products service', async () => {
    vi.mocked(getAllProducts).mockResolvedValue([product])
    const { result } = renderHook(() => useProductsContext(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual([product])
    expect(result.current.error).toBeNull()
  })

  it('exposes an error when loading products fails', async () => {
    vi.mocked(getAllProducts).mockRejectedValue(new Error('Firestore error'))
    const { result } = renderHook(() => useProductsContext(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.products).toEqual([])
    expect(result.current.error).toBe('Unable to load products.')
  })
})
