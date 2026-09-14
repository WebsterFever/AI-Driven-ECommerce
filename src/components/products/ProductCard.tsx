import { Link } from 'react-router-dom'
import type { Product } from '../../types'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <Link
      to={`/products/${product.id}`}
      className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-40 w-full object-cover sm:h-48"
      />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs font-medium uppercase text-slate-400">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
          {product.name}
        </h3>
        <p className="mt-auto text-base font-bold text-blue-600">
          {formattedPrice}
        </p>
      </div>
    </Link>
  )
}

export default ProductCard
