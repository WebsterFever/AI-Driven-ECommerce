import { createContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { useAuth } from '../AuthContext'
import type { CartAction, CartState } from '../../types'
import { cartReducer, initialCartState } from './cartReducer'

interface CartContextValue {
  state: CartState
  dispatch: Dispatch<CartAction>
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)
  const { user } = useAuth()

  // Limpa o carrinho sempre que o usuário logado mudar (logout ou troca de conta),
  // evitando que o próximo usuário "herde" o carrinho do anterior.
  useEffect(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [user?.uid])

  return (
    <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
  )
}
