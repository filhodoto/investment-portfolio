import { cn } from '@/lib/utils'

/**
 * Single source of truth for form control styling — inputs, textareas, selects
 * and the hand-rolled controls in the filter bars all share it.
 *
 * Horizontal padding is deliberately left to callers so each control can pick
 * its own (e.g. the search field leaves room for its icon).
 */
export const CONTROL_CLASSES =
  'block w-full rounded-lg bg-white py-2 text-sm text-slate-900 shadow-xs ring-1 ring-slate-300 ring-inset ' +
  'placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none ' +
  'disabled:bg-slate-50 disabled:text-slate-500 ' +
  'dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:placeholder:text-slate-500 ' +
  'dark:disabled:bg-slate-800 dark:disabled:text-slate-400'

const INVALID_CLASSES =
  'ring-rose-500 focus:ring-rose-500 dark:ring-rose-500 dark:focus:ring-rose-500'

export function controlClasses(options: { invalid?: boolean; className?: string } = {}): string {
  return cn(CONTROL_CLASSES, options.invalid && INVALID_CLASSES, options.className)
}
