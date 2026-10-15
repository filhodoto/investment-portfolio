import { Link } from 'react-router-dom'

import { InvestmentStatusBadge } from '@/features/investments/components/InvestmentStatusBadge'
import { Button } from '@/components/ui/Button'
import { formatArea, formatCurrency, formatDate } from '@/lib/utils'
import type { Investment } from '@/types/models'

export interface InvestmentTableProps {
  investments: Investment[]
  onEdit: (investment: Investment) => void
  onDelete: (investment: Investment) => void
}

export function InvestmentTable({ investments, onEdit, onDelete }: InvestmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[52rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <th scope="col" className="px-5 py-3">Property</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Asking</th>
            <th scope="col" className="px-4 py-3 text-right">Expected</th>
            <th scope="col" className="px-4 py-3">Lawyer</th>
            <th scope="col" className="px-4 py-3">Added</th>
            <th scope="col" className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {investments.map((investment) => (
            <tr key={investment.id} className="transition-colors hover:bg-slate-50/70">
              <td className="max-w-72 px-5 py-3">
                <Link
                  to={`/investments/${investment.id}`}
                  className="font-medium text-slate-900 hover:text-indigo-600"
                >
                  {investment.title}
                </Link>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {[investment.address, investment.city].filter(Boolean).join(', ') || 'No location'}
                  {investment.area_sqm ? ` · ${formatArea(investment.area_sqm)}` : ''}
                </p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-700">{investment.typology}</td>
              <td className="px-4 py-3">
                <InvestmentStatusBadge status={investment.status} />
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums text-slate-700">
                {formatCurrency(investment.asking_price)}
              </td>
              <td className="px-4 py-3 text-right font-medium whitespace-nowrap tabular-nums text-emerald-700">
                {formatCurrency(investment.expected_earnings)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                {investment.lawyer?.name ?? <span className="text-slate-400">—</span>}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-500">
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
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
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
