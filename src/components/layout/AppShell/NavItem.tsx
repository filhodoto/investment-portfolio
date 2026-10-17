import { NavLink } from 'react-router-dom'

import type { NavItemDefinition } from '@/components/layout/AppShell/navItems'
import { cn } from '@/lib/utils'

export interface NavItemProps {
  item: NavItemDefinition
  onNavigate?: () => void
}

export function NavItem({ item, onNavigate }: NavItemProps) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
        )
      }
    >
      <item.Icon className="size-5 shrink-0" />
      {item.label}
    </NavLink>
  )
}
