import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function AdminLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 sm:flex-row">
      <aside className="w-full border-b border-slate-200 bg-white px-4 py-4 sm:w-56 sm:shrink-0 sm:border-b-0 sm:border-r sm:py-6">
        <p className="mb-4 text-lg font-bold text-slate-900 sm:mb-6">Admin</p>
        <nav className="flex flex-wrap gap-2 overflow-x-auto text-sm font-medium text-slate-600 sm:flex-col sm:overflow-visible">
          <Link
            to="/admin"
            className="shrink-0 rounded px-3 py-2 hover:bg-slate-100 hover:text-blue-600"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="shrink-0 rounded px-3 py-2 hover:bg-slate-100 hover:text-blue-600"
          >
            Produtos
          </Link>
          <Link
            to="/admin/orders"
            className="shrink-0 rounded px-3 py-2 hover:bg-slate-100 hover:text-blue-600"
          >
            Pedidos
          </Link>

          <div className="w-full border-t border-slate-200 sm:mt-2 sm:pt-2" />

          <Link
            to="/"
            className="shrink-0 rounded px-3 py-2 hover:bg-slate-100 hover:text-blue-600"
          >
            Voltar à loja
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="shrink-0 rounded px-3 py-2 text-left hover:bg-slate-100 hover:text-blue-600"
          >
            Sair
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
