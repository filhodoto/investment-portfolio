import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

const CONTROL =
  'block w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-900 shadow-xs ring-1 ring-slate-300 ring-inset ' +
  'placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none ' +
  'disabled:bg-slate-50 disabled:text-slate-500 ' +
  'dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:placeholder:text-slate-500 ' +
  'dark:disabled:bg-slate-800 dark:disabled:text-slate-400'

interface FieldShellProps {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  required?: boolean
  hideLabel?: boolean
  children: ReactNode
  className?: string
}

function FieldShell({ label, htmlFor, hint, error, required, hideLabel, children, className }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          'text-sm font-medium text-slate-700 dark:text-slate-300',
          hideLabel && 'sr-only',
        )}
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

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  containerClassName?: string
}

export function Input({ label, hint, error, hideLabel, containerClassName, className, ...props }: InputProps) {
  const id = useId()
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={props.required}
      hideLabel={hideLabel}
      className={containerClassName}
    >
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          CONTROL,
          error && 'ring-rose-500 focus:ring-rose-500 dark:ring-rose-500 dark:focus:ring-rose-500',
          className,
        )}
        {...props}
      />
    </FieldShell>
  )
}

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  containerClassName?: string
}

export function Textarea({
  label,
  hint,
  error,
  hideLabel,
  containerClassName,
  className,
  ...props
}: TextareaProps) {
  const id = useId()
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={props.required}
      hideLabel={hideLabel}
      className={containerClassName}
    >
      <textarea
        id={id}
        rows={4}
        aria-invalid={Boolean(error)}
        className={cn(
          CONTROL,
          'resize-y',
          error && 'ring-rose-500 focus:ring-rose-500 dark:ring-rose-500 dark:focus:ring-rose-500',
          className,
        )}
        {...props}
      />
    </FieldShell>
  )
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  containerClassName?: string
  options: Array<{ value: string; label: string }>
}

export function Select({
  label,
  hint,
  error,
  hideLabel,
  containerClassName,
  className,
  options,
  ...props
}: SelectProps) {
  const id = useId()
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={props.required}
      hideLabel={hideLabel}
      className={containerClassName}
    >
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          CONTROL,
          'pr-8',
          error && 'ring-rose-500 focus:ring-rose-500 dark:ring-rose-500 dark:focus:ring-rose-500',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export { FieldShell, CONTROL }
