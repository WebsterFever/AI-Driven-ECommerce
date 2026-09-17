import { renderHook, waitFor } from '@testing-library/react'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getUserProfile } from '../../services/firebase/auth.service'
import { TestProviders } from '../../test/TestProviders'
import type { User } from '../../types'
import { useAuth } from './useAuth'

vi.mock('../../services/firebase/auth.service', () => ({
  getUserProfile: vi.fn(),
  registerWithEmail: vi.fn(),
  loginWithEmail: vi.fn(),
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
}))

const mockFirebaseUser = { uid: 'user-1' } as FirebaseUser

const mockProfile: User = {
  uid: 'user-1',
  email: 'cliente@teste.com',
  role: 'customer',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.mocked(onAuthStateChanged).mockReset()
  })

  it('mantém user null quando ninguém está logado', async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      ;(callback as (user: FirebaseUser | null) => void)(null)
      return () => {}
    })

    const { result } = renderHook(() => useAuth(), { wrapper: TestProviders })

    await waitFor(() => {
      expect(result.current.loadingUser).toBe(false)
    })

    expect(result.current.user).toBeNull()
  })

  it('carrega o perfil e o role do usuário quando está logado', async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      ;(callback as (user: FirebaseUser | null) => void)(mockFirebaseUser)
      return () => {}
    })
    vi.mocked(getUserProfile).mockResolvedValue(mockProfile)

    const { result } = renderHook(() => useAuth(), { wrapper: TestProviders })

    await waitFor(() => {
      expect(result.current.loadingRole).toBe(false)
    })

    expect(result.current.user).toEqual(mockProfile)
  })
})
