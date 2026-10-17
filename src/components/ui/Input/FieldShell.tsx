import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface FieldShellProps {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  required?: boolean
  hideLabel?: boolean
  children: ReactNode
  className?: string
}

/** Label + control + hint/error, shared by every labelled form field. */
export function FieldShell({
  label,
  htmlFor,
  hint,
  error,
  required,
  hideLabel,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className={cn('text-sm font-medium text-slate-700 dark:text-slate-300', hideLabel && 'sr-only')}
      >
        {label}
        {required && <span className="ml-0.5 text-rose-500 dark:text-rose-400">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}
