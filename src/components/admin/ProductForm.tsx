import { useState, type FormEvent } from 'react'
import type { Category, Product } from '../../types'

const CATEGORIES: Category[] = ['electronics', 'clothing', 'home', 'sports', 'books', 'other']

export interface ProductFormValues {
  name: string
  description: string
  price: number
  category: Category
  imageUrl: string
}

interface ProductFormProps {
  initialValues?: Product
  submitLabel: string
  onSubmit: (values: ProductFormValues) => Promise<void>
}

function ProductForm({ initialValues, submitLabel, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [price, setPrice] = useState(initialValues ? String(initialValues.price) : '')
  const [category, setCategory] = useState<Category>(initialValues?.category ?? 'electronics')
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? '')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await onSubmit({
        name,
        description,
        price: Number(price),
        category,
        imageUrl,
      })
    } catch (err) {
      console.error('Erro ao salvar produto:', err)
      setError('Não foi possível salvar o produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Nome
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Descrição
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Preço (R$)
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Categoria
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        URL da imagem
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Salvando...' : submitLabel}
      </button>
    </form>
  )
}

export default ProductForm
