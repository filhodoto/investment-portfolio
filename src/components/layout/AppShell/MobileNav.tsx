import { useState } from 'react'

import { MenuIcon } from '@/components/icons'
import { Nav } from '@/components/layout/AppShell/Nav'
import { SignOutButton } from '@/features/auth/components/SignOutButton'
import { ThemeSwitcher } from '@/features/theme/components/ThemeSwitcher'
import { APP_NAME } from '@/lib/app'

/** Mobile top bar plus the collapsible navigation drawer. */
export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <MenuIcon className="size-6" />
        </button>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{APP_NAME}</p>
        <SignOutButton />
      </header>

      {open && (
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-3 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-900">
          <Nav onNavigate={() => setOpen(false)} />
          <ThemeSwitcher />
        </div>
      )}
    </>
  )
}
