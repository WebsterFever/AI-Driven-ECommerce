import { useEffect, useState } from 'react'
import { getAllProducts } from '../services/products/products.service'
import type { Product } from '../types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        const data = await getAllProducts()
        if (!cancelled) {
          setProducts(data)
        }
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
        if (!cancelled) {
          setError('Não foi possível carregar os produtos.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading, error }
}
