import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { deleteProduct } from '../../services/products/products.service'

function AdminProducts() {
  const { products, loading, error } = useProducts()
  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(`Delete "${name}"? This action cannot be undone.`)
    if (!confirmed) return
    try { await deleteProduct(id); window.location.reload() }
    catch (err) { console.error('Error deleting product:', err); window.alert('Unable to delete the product.') }
  }
  return <div>
    <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Products</h1><Link to="/admin/products/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">New Product</Link></div>
    {loading && <p className="text-sm text-slate-500">Loading...</p>}{!loading && error && <p className="text-sm text-red-600">{error}</p>}
    {!loading && !error && <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="border-b border-slate-200 text-slate-500"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b border-slate-100 last:border-0"><td className="px-4 py-3 text-slate-900">{product.name}</td><td className="px-4 py-3 text-slate-500">{product.category}</td><td className="px-4 py-3 text-slate-500">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'BRL' })}</td><td className="px-4 py-3"><div className="flex gap-3"><Link to={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:underline">Edit</Link><button type="button" onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:underline">Delete</button></div></td></tr>)}</tbody></table></div>}
  </div>
}

export default AdminProducts
