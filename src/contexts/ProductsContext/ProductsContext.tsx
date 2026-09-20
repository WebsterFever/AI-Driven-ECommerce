import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { getAllProducts } from '../../services/products/products.service'
import type { Product } from '../../types'

interface ProductsContextValue {
  products: Product[]
  loading: boolean
  error: string | null
  reloadProducts: () => Promise<void>
}

export const ProductsContext = createContext<ProductsContextValue | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reloadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setProducts(await getAllProducts())
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Unable to load products.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reloadProducts()
  }, [reloadProducts])

  return (
    <ProductsContext.Provider value={{ products, loading, error, reloadProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}
