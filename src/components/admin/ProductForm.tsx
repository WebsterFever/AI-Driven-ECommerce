import { useState, type ChangeEvent, type FormEvent } from 'react'
import { uploadProductImage } from '../../services/storage/upload.service'
import type { Category, Product } from '../../types'

const CATEGORIES: Category[] = ['electronics', 'clothing', 'home', 'sports', 'books', 'other']
export interface ProductFormValues { name: string; description: string; price: number; category: Category; imageUrl: string }
interface ProductFormProps { initialValues?: Product; submitLabel: string; onSubmit: (values: ProductFormValues) => Promise<void> }

function ProductForm({ initialValues, submitLabel, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [price, setPrice] = useState(initialValues ? String(initialValues.price) : '')
  const [category, setCategory] = useState<Category>(initialValues?.category ?? 'electronics')
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? '')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadingImage(true); setError(null)
    try { setImageUrl(await uploadProductImage(file)) }
    catch (err) { console.error('Error uploading image:', err); setError('Unable to upload the image. Please try again.') }
    finally { setUploadingImage(false) }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setError(null)
    if (!imageUrl) { setError('Upload an image before saving the product.'); return }
    setLoading(true)
    try { await onSubmit({ name, description, price: Number(price), category, imageUrl }) }
    catch (err) { console.error('Error saving product:', err); setError('Unable to save the product. Please try again.') }
    finally { setLoading(false) }
  }

  return <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">Price (R$)<input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">Category<select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select></label>
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Product Image<input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-slate-600" />{uploadingImage && <p className="text-xs text-slate-500">Uploading image...</p>}{imageUrl && !uploadingImage && <img src={imageUrl} alt="Preview" className="h-24 w-24 rounded-lg border border-slate-200 object-cover" />}</label>
    <button type="submit" disabled={loading || uploadingImage} className="rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Saving...' : submitLabel}</button>
  </form>
}

export default ProductForm
