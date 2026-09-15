import { useContext } from 'react'
import type { CartItem } from '../../types'
import { getCartQuantity, getCartTotal } from '../../utils/cart'
import { CartContext } from './CartContext'

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  const { state, dispatch } = context

  function addItem(item: CartItem) {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  function removeItem(id: string) {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }

  function updateQuantity(id: string, quantity: number) {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' })
  }

  return {
    items: state.items,
    total: getCartTotal(state.items),
    quantity: getCartQuantity(state.items),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
