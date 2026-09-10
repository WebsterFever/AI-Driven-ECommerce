import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useEffect, useState, type ReactNode } from 'react'
import {
  getUserProfile,
  loginWithEmail,
  loginWithGoogle,
  logout as logoutService,
  registerWithEmail,
} from '../../services/firebase/auth.service'
import { auth } from '../../services/firebase/config'
import type { AuthState, User } from '../../types'

interface AuthContextValue extends AuthState {
  register: (email: string, password: string, displayName?: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingRole, setLoadingRole] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoadingUser(false)

      if (!firebaseUser) {
        setUser(null)
        return
      }

      setLoadingRole(true)
      const profile = await getUserProfile(firebaseUser.uid)
      setUser(profile)
      setLoadingRole(false)
    })

    return unsubscribe
  }, [])

  async function register(email: string, password: string, displayName?: string) {
    const profile = await registerWithEmail(email, password, displayName)
    setUser(profile)
  }

  async function login(email: string, password: string) {
    await loginWithEmail(email, password)
  }

  async function loginGoogle() {
    const profile = await loginWithGoogle()
    setUser(profile)
  }

  async function logout() {
    await logoutService()
  }

  const value: AuthContextValue = {
    user,
    loadingUser,
    loadingRole,
    register,
    login,                                                                                                       
    loginGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
