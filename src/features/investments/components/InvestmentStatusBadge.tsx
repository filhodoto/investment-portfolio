import { Badge } from '@/components/ui/Badge'
import {
  INVESTMENT_STATUS_LABELS,
  INVESTMENT_STATUS_TONES,
  type InvestmentStatus,
} from '@/types/models'

export function InvestmentStatusBadge({ status }: { status: InvestmentStatus }) {
  return (
    <Badge className={INVESTMENT_STATUS_TONES[status]}>{INVESTMENT_STATUS_LABELS[status]}</Badge>
  )
}
