import type { User } from './user.types'

export interface AuthState {
  user: User | null
  loadingUser: boolean
  loadingRole: boolean
}
