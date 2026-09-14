import ProductCard from '../components/products/ProductCard'
import { useProducts } from '../hooks/useProducts'

function Home() {
  const { products, loading, error } = useProducts()

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Catálogo</h1>

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-56 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-500">
          Não encontramos produtos.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
