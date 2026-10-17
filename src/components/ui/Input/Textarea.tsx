import { useId, type TextareaHTMLAttributes } from 'react'

import { FieldShell } from '@/components/ui/Input/FieldShell'
import { controlClasses } from '@/components/ui/control-classes'

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
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
        className={controlClasses({
          invalid: Boolean(error),
          className: `resize-y px-3 ${className ?? ''}`,
        })}
        {...props}
      />
    </FieldShell>
  )
}
