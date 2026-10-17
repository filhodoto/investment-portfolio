import { useId, type InputHTMLAttributes } from 'react'

import { FieldShell } from '@/components/ui/Input/FieldShell'
import { controlClasses } from '@/components/ui/control-classes'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  containerClassName?: string
}

export function Input({
  label,
  hint,
  error,
  hideLabel,
  containerClassName,
  className,
  ...props
}: InputProps) {
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
        className={controlClasses({ invalid: Boolean(error), className: `px-3 ${className ?? ''}` })}
        {...props}
      />
    </FieldShell>
  )
}
