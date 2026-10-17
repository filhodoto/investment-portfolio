import { SortIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import type { InvestmentSortField, SortDirection } from '@/types/models'

export interface SortableHeaderProps {
  field: InvestmentSortField
  label: string
  align?: 'left' | 'right'
  sort: InvestmentSortField
  direction: SortDirection
  onSort: (field: InvestmentSortField) => void
}

/** Header cell that toggles sorting for its column. */
export function SortableHeader({
  field,
  label,
  align = 'left',
  sort,
  direction,
  onSort,
}: SortableHeaderProps) {
  const isActive = sort === field

  return (
    <th scope="col" className={cn('px-4 py-3', align === 'right' ? 'text-right' : 'text-left')}>
      <button
        type="button"
        onClick={() => onSort(field)}
        aria-label={`Sort by ${label}${isActive ? `, currently ${direction}ending` : ''}`}
        className={cn(
          'group/th inline-flex items-center gap-1 rounded text-xs font-semibold tracking-wide uppercase transition-colors',
          align === 'right' && 'flex-row-reverse',
          isActive
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
        )}
      >
        {label}
        <SortIcon
          className={cn(
            'size-3.5 transition-transform',
            !isActive && 'opacity-0 group-hover/th:opacity-40',
            isActive && direction === 'asc' && 'rotate-180',
          )}
        />
      </button>
    </th>
  )
}
