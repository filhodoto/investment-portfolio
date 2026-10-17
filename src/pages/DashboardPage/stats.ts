import { INVESTMENT_STATUSES, type Investment, type InvestmentStatus } from '@/types/models'

/** Statuses that still represent live opportunities. */
export const ACTIVE_STATUSES: readonly InvestmentStatus[] = [
  'researching',
  'visiting',
  'offer_made',
  'due_diligence',
]

export interface DashboardStats {
  active: Investment[]
  pipelineValue: number
  potentialEarnings: number
  owned: Investment[]
  capitalInvested: number
  byStatus: Array<{ status: InvestmentStatus; count: number }>
  recent: Investment[]
  withoutLawyer: number
}

function sumBy(investments: Investment[], pick: (investment: Investment) => number | null): number {
  return investments.reduce((total, investment) => total + (pick(investment) ?? 0), 0)
}

/** Derives every number the dashboard renders from the full investment list. */
export function computeDashboardStats(investments: Investment[]): DashboardStats {
  const active = investments.filter((investment) => ACTIVE_STATUSES.includes(investment.status))
  const owned = investments.filter(
    (investment) => investment.status === 'purchased' || investment.status === 'sold',
  )

  return {
    active,
    pipelineValue: sumBy(active, (investment) => investment.asking_price),
    potentialEarnings: sumBy(active, (investment) => investment.expected_earnings),
    owned,
    capitalInvested: sumBy(
      owned,
      (investment) => investment.purchase_price ?? investment.asking_price,
    ),
    byStatus: INVESTMENT_STATUSES.map((status) => ({
      status,
      count: investments.filter((investment) => investment.status === status).length,
    })).filter((entry) => entry.count > 0),
    recent: [...investments].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).slice(0, 5),
    withoutLawyer: investments.filter((investment) => !investment.lawyer_id).length,
  }
}
