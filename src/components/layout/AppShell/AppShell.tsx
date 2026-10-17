import { Outlet } from 'react-router-dom'

import { MobileNav } from '@/components/layout/AppShell/MobileNav'
import { Sidebar } from '@/components/layout/AppShell/Sidebar'

export function AppShell() {
  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1400px]">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <MobileNav />

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
