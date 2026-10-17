import { NavItem } from '@/components/layout/AppShell/NavItem'
import { NAV_ITEMS } from '@/components/layout/AppShell/navItems'

/** Vertical navigation. Rendered by both the sidebar and the mobile drawer. */
export function Nav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.to} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}
