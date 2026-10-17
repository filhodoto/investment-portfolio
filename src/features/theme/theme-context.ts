import { createContext } from 'react'

export type Theme = 'light' | 'dark'

/**
 * localStorage key holding the user's *explicit* choice.
 * When it is absent the app follows the operating system preference, so we
 * never write a value the user did not ask for.
 */
export const THEME_STORAGE_KEY = 'goncalo-investments:theme'

export interface ThemeContextValue {
  theme: Theme
  /** True when nothing is stored yet, i.e. we are tracking the OS setting. */
  followsSystem: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Returns the stored choice, or `null` when the user has never chosen. */
export function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : null
  } catch {
    // localStorage can throw in private mode / disabled-cookie contexts.
    return null
  }
}
