import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  getSystemTheme,
  readStoredTheme,
  ThemeContext,
  THEME_STORAGE_KEY,
  type Theme,
  type ThemeContextValue,
} from '@/features/theme/theme-context'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [storedTheme, setStoredTheme] = useState<Theme | null>(() => readStoredTheme())
  const [systemTheme, setSystemTheme] = useState<Theme>(() => getSystemTheme())

  // While no explicit choice exists, keep tracking the OS preference live.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const theme = storedTheme ?? systemTheme

  // The `<html>` class is the single source of truth for Tailwind's `dark:`
  // variant. The inline script in index.html sets it before first paint; this
  // effect keeps it in sync afterwards.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.setProperty('color-scheme', theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setStoredTheme(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Non-fatal: the choice just won't survive a reload.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, followsSystem: storedTheme === null, setTheme, toggleTheme }),
    [theme, storedTheme, setTheme, toggleTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
