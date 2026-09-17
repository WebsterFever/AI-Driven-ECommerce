import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TestProviders } from '../../test/TestProviders'
import { useCart } from './useCart'

describe('useCart', () => {
  it('começa com o carrinho vazio', () => {
    const { result } = renderHook(() => useCart(), { wrapper: TestProviders })

    expect(result.current.items).toEqual([])
    expect(result.current.total).toBe(0)
    expect(result.current.quantity).toBe(0)
  })

  it('adiciona um item e atualiza total e quantity derivados', () => {
    const { result } = renderHook(() => useCart(), { wrapper: TestProviders })

    act(() => {
      result.current.addItem({
        id: 'product-1',
        name: 'Produto Teste',
        price: 50,
        imageUrl: 'https://example.com/img.jpg',
        quantity: 2,
      })
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.total).toBe(100)
    expect(result.current.quantity).toBe(2)
  })

  it('remove um item do carrinho', () => {
    const { result } = renderHook(() => useCart(), { wrapper: TestProviders })

    act(() => {
      result.current.addItem({
        id: 'product-1',
        name: 'Produto Teste',
        price: 50,
        imageUrl: 'https://example.com/img.jpg',
        quantity: 1,
      })
    })

    act(() => {
      result.current.removeItem('product-1')
    })

    expect(result.current.items).toEqual([])
  })

  it('limpa o carrinho por completo', () => {
    const { result } = renderHook(() => useCart(), { wrapper: TestProviders })

    act(() => {
      result.current.addItem({
        id: 'product-1',
        name: 'Produto Teste',
        price: 50,
        imageUrl: 'https://example.com/img.jpg',
        quantity: 1,
      })
    })

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.items).toEqual([])
    expect(result.current.total).toBe(0)
  })
})
