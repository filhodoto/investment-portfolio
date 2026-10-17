import { Nav } from '@/components/layout/AppShell/Nav'
import { UserMenu } from '@/components/layout/AppShell/UserMenu'
import { ThemeSwitcher } from '@/features/theme/components/ThemeSwitcher'
import { APP_NAME } from '@/lib/app'

/** Desktop navigation column. Hidden below the `lg` breakpoint. */
export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-5 lg:flex dark:border-slate-800 dark:bg-slate-900">
      <div className="px-2 pb-5">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{APP_NAME}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Deal filing &amp; tracking</p>
      </div>

      <Nav />

      <div className="mt-auto flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="px-1">
          <ThemeSwitcher />
        </div>
        <UserMenu />
      </div>
    </aside>
  )
}
