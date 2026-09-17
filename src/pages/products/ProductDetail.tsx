import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useProduct } from '../../hooks/useProduct'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useProduct(id)
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><p className="text-sm text-slate-500">Loading...</p></div>
  if (error || !product) return <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center"><p className="text-sm text-red-600">{error ?? 'Product not found.'}</p><Link to="/" className="font-medium text-blue-600 hover:underline">Back to catalog</Link></div>

  // Store the validated product in a new constant after the null check above.
  // TypeScript does not preserve the narrowing of "product" inside every nested
  // function, so this constant keeps the Product type non-null for the handler.
  const currentProduct = product
  const formattedPrice = currentProduct.price.toLocaleString('en-US', { style: 'currency', currency: 'BRL' })

  function handleAddToCart() {
    addItem({ id: currentProduct.id, name: currentProduct.name, price: currentProduct.price, imageUrl: currentProduct.imageUrl, quantity })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
    <Link to="/" className="mb-4 inline-block text-sm font-medium text-blue-600 hover:underline">← Back to catalog</Link>
    <div className="grid gap-6 overflow-hidden rounded-2xl bg-white shadow-sm sm:grid-cols-2">
      <img src={currentProduct.imageUrl} alt={currentProduct.name} className="h-64 w-full object-cover sm:h-full" />
      <div className="flex flex-col gap-3 p-6"><span className="text-xs font-medium uppercase text-slate-400">{currentProduct.category}</span><h1 className="text-2xl font-bold text-slate-900">{currentProduct.name}</h1><p className="text-sm leading-relaxed text-slate-600">{currentProduct.description}</p><p className="text-2xl font-bold text-blue-600">{formattedPrice}</p><div className="mt-auto flex flex-col gap-3"><div className="flex items-center gap-3"><button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded-lg border border-slate-300 text-lg font-semibold text-slate-700 hover:bg-slate-50">−</button><span className="w-8 text-center font-medium text-slate-900">{quantity}</span><button type="button" onClick={() => setQuantity((q) => q + 1)} className="h-9 w-9 rounded-lg border border-slate-300 text-lg font-semibold text-slate-700 hover:bg-slate-50">+</button></div><button type="button" onClick={handleAddToCart} className="rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">{justAdded ? 'Added to cart!' : 'Add to cart'}</button></div></div>
    </div>
  </div>
}

export default ProductDetail
