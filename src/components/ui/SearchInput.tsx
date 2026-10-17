import { SearchIcon } from '@/components/icons'
import { controlClasses } from '@/components/ui/control-classes'
import { cn } from '@/lib/utils'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  'aria-label': string
  className?: string
}

/** Search field with the leading magnifier icon, shared by both filter bars. */
export function SearchInput({
  value,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={controlClasses({ className: 'pr-3 pl-9' })}
      />
    </div>
  )
}
