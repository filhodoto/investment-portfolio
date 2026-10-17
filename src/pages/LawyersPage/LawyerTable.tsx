import { Button } from '@/components/ui/Button'
import { CardBody } from '@/components/ui/Card'
import type { Lawyer } from '@/types/models'

export interface LawyerTableProps {
  lawyers: Lawyer[]
  totalCount: number
  investmentCounts: Map<string, number>
  onEdit: (lawyer: Lawyer) => void
  onDelete: (lawyer: Lawyer) => void
}

const DELETE_CLASSES =
  'text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-300'

export function LawyerTable({
  lawyers,
  totalCount,
  investmentCounts,
  onEdit,
  onDelete,
}: LawyerTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[54rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase dark:border-slate-800 dark:text-slate-400">
            <th scope="col" className="px-5 py-3">
              Name
            </th>
            <th scope="col" className="px-4 py-3">
              Contact
            </th>
            <th scope="col" className="px-4 py-3">
              Office
            </th>
            <th scope="col" className="px-4 py-3">
              Country
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Deals
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {lawyers.map((lawyer) => {
            const count = investmentCounts.get(lawyer.id) ?? 0
            return (
              <tr
                key={lawyer.id}
                className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
              >
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{lawyer.name}</p>
                  {lawyer.notes && (
                    <p className="mt-0.5 line-clamp-1 max-w-72 text-xs text-slate-500 dark:text-slate-400">
                      {lawyer.notes}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    {lawyer.email ? (
                      <a
                        href={`mailto:${lawyer.email}`}
                        className="text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                      >
                        {lawyer.email}
                      </a>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">—</span>
                    )}
                    {lawyer.phone && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {lawyer.phone}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                  {lawyer.office ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                  {lawyer.country ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {count > 0 ? (
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{count}</span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">0</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(lawyer)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={DELETE_CLASSES}
                      onClick={() => onDelete(lawyer)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <CardBody className="border-t border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Showing {lawyers.length} of {totalCount} lawyers. Deleting a lawyer keeps their investments —
        the link is simply cleared.
      </CardBody>
    </div>
  )
}
