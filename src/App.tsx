import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { isSupabaseConfigured } from '@/lib/env'
import { DashboardPage } from '@/pages/DashboardPage'
import { InvestmentDetailPage } from '@/pages/InvestmentDetailPage'
import { InvestmentsPage } from '@/pages/InvestmentsPage'
import { LawyersPage } from '@/pages/LawyersPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function SetupNotice() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Connect your Supabase project
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          The app is running but has no credentials yet. Create a Supabase project, then copy{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.env.example</code> to{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.env.local</code> and fill in
          the two values.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
          {`VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>`}
        </pre>
        <p className="mt-4 text-sm text-slate-600">
          Then push the schema with{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">npm run db:push</code> and
          restart the dev server.
        </p>
      </div>
    </div>
  )
}

export function App() {
  if (!isSupabaseConfigured) {
    return <SetupNotice />
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="investments" element={<InvestmentsPage />} />
        <Route path="investments/:id" element={<InvestmentDetailPage />} />
        <Route path="lawyers" element={<LawyersPage />} />
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}
