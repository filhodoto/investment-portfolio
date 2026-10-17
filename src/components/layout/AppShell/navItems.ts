import type { ComponentType } from 'react'

import { BuildingIcon, ChartBarIcon, ShieldCheckIcon, type IconProps } from '@/components/icons'

export interface NavItemDefinition {
  to: string
  label: string
  end: boolean
  Icon: ComponentType<IconProps>
}

export const NAV_ITEMS: NavItemDefinition[] = [
  { to: '/', label: 'Dashboard', end: true, Icon: ChartBarIcon },
  { to: '/investments', label: 'Investments', end: false, Icon: BuildingIcon },
  { to: '/lawyers', label: 'Lawyers', end: false, Icon: ShieldCheckIcon },
]
