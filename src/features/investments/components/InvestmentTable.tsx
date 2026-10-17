import { Link } from 'react-router-dom'

import { InvestmentStatusBadge } from '@/features/investments/components/InvestmentStatusBadge'
import { Button } from '@/components/ui/Button'
import { cn, formatArea, formatCurrency, formatDate } from '@/lib/utils'
import type { Investment, InvestmentSortField, SortDirection } from '@/types/models'

/** Header cell that toggles sorting for a column. */
function SortableHeader({
  field,
  label,
  align = 'left',
  sort,
  direction,
  onSort,
}: {
  field: InvestmentSortField
  label: string
  align?: 'left' | 'right'
  sort: InvestmentSortField
  direction: SortDirection
  onSort: (field: InvestmentSortField) => void
}) {
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
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className={cn(
            'size-3.5 transition-transform',
            !isActive && 'opacity-0 group-hover/th:opacity-40',
            isActive && direction === 'asc' && 'rotate-180',
          )}
        >
          <path
            fillRule="evenodd"
            d="M10 3a.75.75 0 0 1 .55.24l3.25 3.5a.75.75 0 1 1-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 0 1-1.1-1.02l3.25-3.5A.75.75 0 0 1 10 3Z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M10 17a.75.75 0 0 1-.55-.24l-3.25-3.5a.75.75 0 1 1 1.1-1.02L10 15.148l2.7-2.908a.75.75 0 1 1 1.1 1.02l-3.25 3.5A.75.75 0 0 1 10 17Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </th>
  )
}

export interface InvestmentTableProps {
  investments: Investment[]
  sort: InvestmentSortField
  direction: SortDirection
  onSort: (field: InvestmentSortField) => void
  onEdit: (investment: Investment) => void
  onDelete: (investment: Investment) => void
}

export function InvestmentTable({
  investments,
  sort,
  direction,
  onSort,
  onEdit,
  onDelete,
}: InvestmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[62rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:border-slate-800 dark:text-slate-400">
            <th scope="col" className="px-5 py-3 text-left">Property</th>
            <th scope="col" className="px-4 py-3 text-left">Type</th>
            <th scope="col" className="px-4 py-3 text-left">Status</th>
            <th scope="col" className="px-4 py-3 text-left">Country</th>
            <SortableHeader
              field="asking_price"
              label="Asking"
              align="right"
              sort={sort}
              direction={direction}
              onSort={onSort}
            />
            <SortableHeader
              field="expected_earnings"
              label="Expected"
              align="right"
              sort={sort}
              direction={direction}
              onSort={onSort}
            />
            <th scope="col" className="px-4 py-3 text-left">Lawyer</th>
            <SortableHeader
              field="created_at"
              label="Added"
              sort={sort}
              direction={direction}
              onSort={onSort}
            />
            <th scope="col" className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {investments.map((investment) => (
            <tr
              key={investment.id}
              className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
            >
              <td className="max-w-72 px-5 py-3">
                <Link
                  to={`/investments/${investment.id}`}
                  className="font-medium text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
                >
                  {investment.title}
                </Link>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {[investment.address, investment.city].filter(Boolean).join(', ') || 'No location'}
                  {investment.area_sqm ? ` · ${formatArea(investment.area_sqm)}` : ''}
                </p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                {investment.typology}
              </td>
              <td className="px-4 py-3">
                <InvestmentStatusBadge status={investment.status} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                {investment.country || <span className="text-slate-400 dark:text-slate-500">—</span>}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums text-slate-700 dark:text-slate-300">
                {formatCurrency(investment.asking_price)}
              </td>
              <td className="px-4 py-3 text-right font-medium whitespace-nowrap tabular-nums text-emerald-700 dark:text-emerald-400">
                {formatCurrency(investment.expected_earnings)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                {investment.lawyer?.name ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                {formatDate(investment.created_at)}
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(investment)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-300"
                    onClick={() => onDelete(investment)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
