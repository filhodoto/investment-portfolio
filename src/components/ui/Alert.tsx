import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AlertTone = 'error' | 'success'

/** Inline message banner. Replaces the rose/emerald paragraph duplicated across screens. */
const TONES: Record<AlertTone, string> = {
  error:
    'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900',
  success:
    'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900',
}

export interface AlertProps {
  tone?: AlertTone
  className?: string
  children: ReactNode
}

export function Alert({ tone = 'error', className, children }: AlertProps) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('rounded-lg px-3 py-2 text-sm ring-1 ring-inset', TONES[tone], className)}
    >
      {children}
    </p>
  )
}
