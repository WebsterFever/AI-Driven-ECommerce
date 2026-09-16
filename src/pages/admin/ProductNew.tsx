import { useNavigate } from 'react-router-dom'
import ProductForm from '../../components/admin/ProductForm'
import { createProduct } from '../../services/products/products.service'

function ProductNew() {
  const navigate = useNavigate()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Novo produto</h1>
      <ProductForm
        submitLabel="Criar produto"
        onSubmit={async (values) => {
          await createProduct(values)
          navigate('/admin/products')
        }}
      />
    </div>
  )
}

export default ProductNew
