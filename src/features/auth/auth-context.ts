import type { Session, User } from '@supabase/supabase-js'
import { createContext } from 'react'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export interface SignUpResult {
  /** True when Supabase requires the user to confirm their email first. */
  needsEmailConfirmation: boolean
}

export interface AuthContextValue {
  status: AuthStatus
  session: Session | null
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<SignUpResult>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
