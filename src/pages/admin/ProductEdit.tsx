import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../components/admin/ProductForm'
import { useProduct } from '../../hooks/useProduct'
import { updateProduct } from '../../services/products/products.service'

function ProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id)
  if (loading) return <p className="text-sm text-slate-500">Loading...</p>
  if (error || !product) return <p className="text-sm text-red-600">{error ?? 'Product not found.'}</p>
  return <div>
    <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Product</h1>
    <ProductForm initialValues={product} submitLabel="Save Changes" onSubmit={async (values) => { await updateProduct(product.id, values); navigate('/admin/products') }} />
  </div>
}

export default ProductEdit
