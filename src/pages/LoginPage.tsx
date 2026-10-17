import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { APP_NAME } from '@/lib/app'
import { toErrorMessage } from '@/lib/utils'

type Mode = 'signin' | 'signup'

const MODES: Array<{ value: Mode; label: string }> = [
  { value: 'signin', label: 'Sign in' },
  { value: 'signup', label: 'Create account' },
]

export function LoginPage() {
  const { status, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setNotice(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password)
        void navigate(from, { replace: true })
      } else {
        const { needsEmailConfirmation } = await signUp(email.trim(), password)
        if (needsEmailConfirmation) {
          setNotice('Check your inbox to confirm your email address, then sign in.')
        } else {
          void navigate(from, { replace: true })
        }
      }
    } catch (submitError) {
      setError(toErrorMessage(submitError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {APP_NAME}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Filing and tracking for property deals.
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {MODES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setMode(option.value)
                  setError(null)
                  setNotice(null)
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === option.value
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              label="Password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {error && <Alert>{error}</Alert>}
            {notice && <Alert tone="success">{notice}</Alert>}

            <Button type="submit" loading={submitting} className="w-full">
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          Data is stored in your Supabase project and protected by Row Level Security.
        </p>
      </div>
    </div>
  )
}
