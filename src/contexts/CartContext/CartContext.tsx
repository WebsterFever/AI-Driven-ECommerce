import { createContext, useReducer, type Dispatch, type ReactNode } from 'react'
import type { CartAction, CartState } from '../../types'
import { cartReducer, initialCartState } from './cartReducer'

interface CartContextValue {
  state: CartState
  dispatch: Dispatch<CartAction>
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
  )
}
