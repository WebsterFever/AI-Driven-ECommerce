import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'

function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()

  const formattedTotal = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
        <h1 className="text-xl font-bold text-slate-900">Seu carrinho está vazio</h1>
        <Link to="/" className="font-medium text-blue-600 hover:underline">
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Carrinho</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const formattedPrice = item.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })

          return (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white p-4"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-16 w-16 rounded object-cover"
              />

              <div className="min-w-[120px] flex-1">
                <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                <p className="text-sm text-blue-600">{formattedPrice}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Remover
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex flex-col items-end gap-3 border-t border-slate-200 pt-4">
        <p className="text-lg font-bold text-slate-900">Total: {formattedTotal}</p>
        <button
          type="button"
          onClick={clearCart}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Limpar carrinho
        </button>
      </div>
    </div>
  )
}

export default Cart
