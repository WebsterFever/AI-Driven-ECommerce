import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import type { User } from '../../types'

interface HeaderLinksProps {
  user: User | null
  quantity: number
  onLogout: () => void
  onNavigate: () => void
}

function HeaderLinks({ user, quantity, onLogout, onNavigate }: HeaderLinksProps) {
  return (
    <>
      <Link
        to="/cart"
        onClick={onNavigate}
        className="flex items-center gap-1 hover:text-blue-600"
      >
        Carrinho
        {quantity > 0 && (
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
            {quantity}
          </span>
        )}
      </Link>

      {user ? (
        <>
          <span className="text-slate-500">Olá, {user.displayName || user.email}</span>
          <Link to="/orders" onClick={onNavigate} className="hover:text-blue-600">
            Meus pedidos
          </Link>
          {user.role === 'admin' && (
            <Link to="/admin" onClick={onNavigate} className="hover:text-blue-600">
              Admin
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              onLogout()
              onNavigate()
            }}
            className="text-left hover:text-blue-600"
          >
            Sair
          </button>
        </>
      ) : (
        <Link to="/login" onClick={onNavigate} className="hover:text-blue-600">
          Entrar
        </Link>
      )}
    </>
  )
}

function Header() {
  const { user, logout } = useAuth()
  const { quantity } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenu} className="text-lg font-bold text-slate-900">
          Patagonix Tech
        </Link>

        {/* Menu horizontal — visível a partir de sm (tablet/desktop) */}
        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 sm:flex">
          <HeaderLinks
            user={user}
            quantity={quantity}
            onLogout={logout}
            onNavigate={closeMenu}
          />
        </nav>

        {/* Botão hambúrguer — visível só no mobile (abaixo de sm) */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-lg sm:hidden"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menu suspenso — só no mobile, só quando aberto */}
      {isMenuOpen && (
        <nav className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-600 sm:hidden">
          <HeaderLinks
            user={user}
            quantity={quantity}
            onLogout={logout}
            onNavigate={closeMenu}
          />
        </nav>
      )}
    </header>
  )
}

export default Header
