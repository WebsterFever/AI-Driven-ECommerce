import { describe, expect, it } from 'vitest'
import type { CartItem, CartState } from '../../types'
import { cartReducer, initialCartState } from './cartReducer'

const mockItem: CartItem = {
  id: 'product-1',
  name: 'Fone de Ouvido',
  price: 100,
  imageUrl: 'https://example.com/fone.jpg',
  quantity: 1,
}

describe('cartReducer', () => {
  it('adiciona um novo item a um carrinho vazio', () => {
    const result = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: mockItem,
    })

    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toEqual(mockItem)
  })

  it('soma a quantidade quando o item já existe no carrinho', () => {
    const stateWithItem: CartState = { items: [mockItem] }

    const result = cartReducer(stateWithItem, {
      type: 'ADD_ITEM',
      payload: { ...mockItem, quantity: 2 },
    })

    expect(result.items).toHaveLength(1)
    expect(result.items[0].quantity).toBe(3)
  })

  it('remove o item correto do carrinho', () => {
    const secondItem: CartItem = { ...mockItem, id: 'product-2' }
    const stateWithTwoItems: CartState = { items: [mockItem, secondItem] }

    const result = cartReducer(stateWithTwoItems, {
      type: 'REMOVE_ITEM',
      payload: { id: 'product-1' },
    })

    expect(result.items).toHaveLength(1)
    expect(result.items[0].id).toBe('product-2')
  })

  it('atualiza a quantidade de um item', () => {
    const stateWithItem: CartState = { items: [mockItem] }

    const result = cartReducer(stateWithItem, {
      type: 'UPDATE_QUANTITY',
      payload: { id: 'product-1', quantity: 5 },
    })

    expect(result.items[0].quantity).toBe(5)
  })

  it('remove o item quando a quantidade cai pra zero ou menos', () => {
    const stateWithItem: CartState = { items: [mockItem] }

    const result = cartReducer(stateWithItem, {
      type: 'UPDATE_QUANTITY',
      payload: { id: 'product-1', quantity: 0 },
    })

    expect(result.items).toHaveLength(0)
  })

  it('esvazia o carrinho por completo', () => {
    const stateWithItem: CartState = { items: [mockItem] }

    const result = cartReducer(stateWithItem, { type: 'CLEAR_CART' })

    expect(result.items).toEqual([])
  })
})
