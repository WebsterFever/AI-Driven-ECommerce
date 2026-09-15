import type { CartItem } from '../types'

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function getCartQuantity(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}
