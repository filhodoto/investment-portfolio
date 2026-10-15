import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { AuthContext, type AuthContextValue, type AuthStatus, type SignUpResult } from '@/features/auth/auth-context'
import { queryClient } from '@/lib/queryClient'
import { supabase } from '@/lib/supabaseClient'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setStatus(data.session ? 'authenticated' : 'anonymous')
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, nextSession: Session | null) => {
        setSession(nextSession)
        setStatus(nextSession ? 'authenticated' : 'anonymous')

        // Server-side data is scoped to the signed-in user, so the cache must
        // never survive an identity change.
        if (event === 'SIGNED_OUT') {
          queryClient.clear()
        }
      },
    )

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signUp = useCallback(async (email: string, password: string): Promise<SignUpResult> => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return { needsEmailConfirmation: !data.session }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    queryClient.clear()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ status, session, user: session?.user ?? null, signIn, signUp, signOut }),
    [status, session, signIn, signUp, signOut],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
