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
import { SetupNotice } from '@/pages/SetupNotice'

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
