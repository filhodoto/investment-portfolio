import { useId, type SelectHTMLAttributes } from 'react'

import { FieldShell } from '@/components/ui/Input/FieldShell'
import { controlClasses } from '@/components/ui/control-classes'

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
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
        className={controlClasses({
          invalid: Boolean(error),
          className: `pl-3 pr-8 ${className ?? ''}`,
        })}
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
