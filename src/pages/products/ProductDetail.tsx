import { Link, useParams } from 'react-router-dom'
import { useProduct } from '../../hooks/useProduct'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useProduct(id)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Carregando...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
        <p className="text-sm text-red-600">{error ?? 'Produto não encontrado.'}</p>
        <Link to="/" className="font-medium text-blue-600 hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-4 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        ← Voltar ao catálogo
      </Link>

      <div className="grid gap-6 overflow-hidden rounded-2xl bg-white shadow-sm sm:grid-cols-2">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-64 w-full object-cover sm:h-full"
        />

        <div className="flex flex-col gap-3 p-6">
          <span className="text-xs font-medium uppercase text-slate-400">
            {product.category}
          </span>
          <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
          <p className="mt-auto text-2xl font-bold text-blue-600">{formattedPrice}</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
