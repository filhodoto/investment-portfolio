import { Link, useNavigate } from 'react-router-dom'

import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { LoadingState } from '@/components/ui/Spinner'
import { InvestmentStatusBadge } from '@/features/investments/components/InvestmentStatusBadge'
import { useInvestments } from '@/features/investments/hooks/useInvestments'
import { useLawyers } from '@/features/lawyers/hooks/useLawyers'
import { formatCurrency, formatDate, toErrorMessage } from '@/lib/utils'
import {
  EMPTY_FILTERS,
  INVESTMENT_STATUSES,
  type Investment,
} from '@/types/models'

/** Statuses that still represent live opportunities. */
const ACTIVE_STATUSES = ['researching', 'visiting', 'offer_made', 'due_diligence'] as const

function sumBy(investments: Investment[], pick: (investment: Investment) => number | null): number {
  return investments.reduce((total, investment) => total + (pick(investment) ?? 0), 0)
}

function StatCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'positive'
}) {
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

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: investments, isLoading, isError, error, refetch } = useInvestments(EMPTY_FILTERS)
  const { data: lawyers } = useLawyers()

  if (isLoading) return <LoadingState label="Loading dashboard…" />
  if (isError) return <ErrorState description={toErrorMessage(error)} onRetry={() => void refetch()} />

  const all = investments ?? []
  const active = all.filter((investment) =>
    (ACTIVE_STATUSES as readonly string[]).includes(investment.status),
  )
  const pipelineValue = sumBy(active, (investment) => investment.asking_price)
  const potentialEarnings = sumBy(active, (investment) => investment.expected_earnings)
  const owned = all.filter((investment) => investment.status === 'purchased' || investment.status === 'sold')
  const capitalInvested = sumBy(owned, (investment) => investment.purchase_price ?? investment.asking_price)

  const byStatus = INVESTMENT_STATUSES.map((status) => ({
    status,
    count: all.filter((investment) => investment.status === status).length,
  })).filter((entry) => entry.count > 0)

  const recent = [...all]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 5)

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A snapshot of your property pipeline."
        actions={
          <Link
            to="/investments"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all investments →
          </Link>
        }
      />

      {all.length === 0 ? (
        <Card>
          <EmptyState
            title="Nothing filed yet"
            description="Once you add investments, this dashboard will show your pipeline value, expected earnings and progress."
            actionLabel="Go to investments"
            onAction={() => void navigate('/investments')}
          />
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Live opportunities"
              value={String(active.length)}
              hint={`${all.length} filed in total`}
            />
            <StatCard
              label="Pipeline value"
              value={formatCurrency(pipelineValue)}
              hint="Asking prices of live deals"
            />
            <StatCard
              label="Potential earnings"
              value={formatCurrency(potentialEarnings)}
              hint="Expected earnings on live deals"
              tone="positive"
            />
            <StatCard
              label="Capital invested"
              value={formatCurrency(capitalInvested)}
              hint={`${owned.length} purchased or sold`}
            />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader
                title="Recently filed"
                description="The five most recent investments."
                actions={
                  <Link
                    to="/investments"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    See all
                  </Link>
                }
              />
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {recent.map((investment) => (
                  <li key={investment.id}>
                    <Link
                      to={`/investments/${investment.id}`}
                      className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                          {investment.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                          {[investment.city, investment.typology].filter(Boolean).join(' · ')} ·{' '}
                          {formatDate(investment.created_at)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm tabular-nums text-slate-700 dark:text-slate-300">
                          {formatCurrency(investment.asking_price)}
                        </span>
                        <InvestmentStatusBadge status={investment.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex flex-col gap-5">
              <Card>
                <CardHeader title="By status" />
                <CardBody>
                  <ul className="flex flex-col gap-2">
                    {byStatus.map((entry) => (
                      <li key={entry.status} className="flex items-center justify-between gap-3">
                        <InvestmentStatusBadge status={entry.status} />
                        <span className="text-sm font-medium tabular-nums text-slate-700 dark:text-slate-300">
                          {entry.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardHeader
                  title="Lawyers"
                  actions={
                    <Link
                      to="/lawyers"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Manage
                    </Link>
                  }
                />
                <CardBody>
                  <p className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    {lawyers?.length ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {all.filter((investment) => !investment.lawyer_id).length} deals without a lawyer
                    assigned
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  )
}
