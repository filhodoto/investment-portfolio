import { Button } from '@/components/ui/Button'
import { CardBody } from '@/components/ui/Card'
import { markdownToPlainText } from '@/components/ui/Markdown'
import type { MortgageBroker } from '@/types/models'

export interface MortgageBrokerTableProps {
  brokers: MortgageBroker[]
  totalCount: number
  onEdit: (broker: MortgageBroker) => void
  onDelete: (broker: MortgageBroker) => void
}

const DELETE_CLASSES =
  'text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-300'

export function MortgageBrokerTable({
  brokers,
  totalCount,
  onEdit,
  onDelete,
}: MortgageBrokerTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[54rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase dark:border-slate-800 dark:text-slate-400">
            <th scope="col" className="px-5 py-3">
              Name
            </th>
            <th scope="col" className="px-4 py-3">
              Website
            </th>
            <th scope="col" className="px-4 py-3">
              Country
            </th>
            <th scope="col" className="px-4 py-3">
              Notes
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {brokers.map((broker) => (
            <tr
              key={broker.id}
              className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
            >
              <td className="px-5 py-3">
                <p className="font-medium text-slate-900 dark:text-slate-100">{broker.name}</p>
              </td>
              <td className="px-4 py-3">
                {broker.website ? (
                  <a
                    href={broker.website}
                    target="_blank"
                    rel="noreferrer"
                    title={broker.website}
                    className="block max-w-64 truncate text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                  >
                    {broker.website}
                  </a>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">—</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                {broker.country ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
              </td>
              <td className="px-4 py-3">
                {broker.notes ? (
                  <p
                    className="max-w-72 truncate text-slate-700 dark:text-slate-300"
                    title={broker.notes}
                  >
                    {markdownToPlainText(broker.notes)}
                  </p>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">—</span>
                )}
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(broker)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={DELETE_CLASSES}
                    onClick={() => onDelete(broker)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CardBody className="border-t border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Showing {brokers.length} of {totalCount} mortgage brokers.
      </CardBody>
    </div>
  )
}
