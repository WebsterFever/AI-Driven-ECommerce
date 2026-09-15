import type { CartAction, CartState } from '../../types'

export const initialCartState: CartState = {
  items: [],
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        }
      }

      return {
        items: [...state.items, action.payload],
      }
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter((item) => item.id !== action.payload.id),
        }
      }

      return {
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }
    }

    case 'CLEAR_CART': {
      return { items: [] }
    }

    default:
      return state
  }
}
