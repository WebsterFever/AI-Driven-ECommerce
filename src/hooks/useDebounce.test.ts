import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('a', 500))

    expect(result.current).toBe('a')
  })

  it('não atualiza o valor antes do delay terminar', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('a')
  })

  it('atualiza o valor depois que o delay termina', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('b')
  })

  it('reinicia o timer se o valor mudar de novo antes do delay terminar', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    rerender({ value: 'c' })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Ainda não passaram 500ms desde a última mudança ('c'), então continua 'a'
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('c')
  })
})
