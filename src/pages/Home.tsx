import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const { user, loadingUser, loadingRole, logout } = useAuth()

  if (loadingUser || loadingRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Você não está logado</h1>
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Ir para login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        Bem-vindo, {user.displayName || user.email}
      </h1>
      <p className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
        role: {user.role}
      </p>
      <button
        type="button"
        onClick={() => logout()}
        className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
      >
        Sair
      </button>
    </div>
  )
}

export default Home
