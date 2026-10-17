import type { ReactNode } from 'react'

import { MoonIcon, SunIcon } from '@/components/icons'
import { useTheme } from '@/features/theme/hooks/useTheme'
import type { Theme } from '@/features/theme/theme-context'
import { cn } from '@/lib/utils'

const OPTIONS: Array<{ value: Theme; label: string; icon: ReactNode }> = [
  { value: 'light', label: 'Light', icon: <SunIcon className="size-4" /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon className="size-4" /> },
]

/** Segmented Light/Dark control, pinned to the bottom of the navigation. */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
    >
      {OPTIONS.map((option) => {
        const isActive = theme === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={isActive}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
