import { Card, CardBody } from '@/components/ui/Card'

export interface StatCardProps {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'positive'
}

export function StatCard({ label, value, hint, tone = 'default' }: StatCardProps) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {label}
        </p>
        <p
          className={`mt-1.5 text-2xl font-semibold tabular-nums ${
            tone === 'positive'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      </CardBody>
    </Card>
  )
}
