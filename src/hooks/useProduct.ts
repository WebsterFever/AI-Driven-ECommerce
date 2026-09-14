import { useEffect, useState } from 'react'
import { getProductById } from '../services/products/products.service'
import type { Product } from '../types'

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      if (!id) {
        setError('Produto não encontrado.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await getProductById(id)

        if (!cancelled) {
          if (data) {
            setProduct(data)
          } else {
            setError('Produto não encontrado.')
          }
        }
      } catch (err) {
        console.error('Erro ao buscar produto:', err)
        if (!cancelled) {
          setError('Não foi possível carregar o produto.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      cancelled = true
    }
  }, [id])

  return { product, loading, error }
}
