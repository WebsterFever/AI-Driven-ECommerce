import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual<typeof import('firebase/auth')>('firebase/auth')

  return {
    ...actual,
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((_auth, callback) => {
      callback(null)
      return () => {}
    }),
  }
})
