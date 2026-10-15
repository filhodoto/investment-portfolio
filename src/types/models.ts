// Domain models. These are the shapes the UI talks in — services map raw
// Supabase rows onto them, so components never depend on column naming quirks.

export const INVESTMENT_TYPOLOGIES = [
  'T0',
  'T1',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7+',
  'House',
  'Land',
  'Commercial',
  'Other',
] as const
export type InvestmentTypology = (typeof INVESTMENT_TYPOLOGIES)[number]

export const INVESTMENT_STATUSES = [
  'researching',
  'visiting',
  'offer_made',
  'due_diligence',
  'purchased',
  'sold',
  'rejected',
] as const
export type InvestmentStatus = (typeof INVESTMENT_STATUSES)[number]

export const INVESTMENT_STATUS_LABELS: Record<InvestmentStatus, string> = {
  researching: 'Researching',
  visiting: 'Visiting',
  offer_made: 'Offer made',
  due_diligence: 'Due diligence',
  purchased: 'Purchased',
  sold: 'Sold',
  rejected: 'Rejected',
}

export const INVESTMENT_STATUS_TONES: Record<InvestmentStatus, string> = {
  researching: 'bg-slate-100 text-slate-700 ring-slate-200',
  visiting: 'bg-sky-100 text-sky-700 ring-sky-200',
  offer_made: 'bg-amber-100 text-amber-800 ring-amber-200',
  due_diligence: 'bg-violet-100 text-violet-700 ring-violet-200',
  purchased: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  sold: 'bg-teal-100 text-teal-700 ring-teal-200',
  rejected: 'bg-rose-100 text-rose-700 ring-rose-200',
}

export interface Lawyer {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  office: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface InvestmentLawyerRef {
  id: string
  name: string
}

export interface Investment {
  id: string
  user_id: string
  title: string
  address: string | null
  city: string | null
  country: string
  typology: InvestmentTypology
  status: InvestmentStatus
  asking_price: number | null
  purchase_price: number | null
  expected_earnings: number | null
  area_sqm: number | null
  lawyer_id: string | null
  source_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
  /** Embedded via PostgREST select — present on list/detail queries. */
  lawyer: InvestmentLawyerRef | null
}

export type LawyerInput = {
  name: string
  email?: string | null
  phone?: string | null
  office?: string | null
  notes?: string | null
}

export type InvestmentInput = {
  title: string
  address?: string | null
  city?: string | null
  country?: string
  typology: InvestmentTypology
  status: InvestmentStatus
  asking_price?: number | null
  purchase_price?: number | null
  expected_earnings?: number | null
  area_sqm?: number | null
  lawyer_id?: string | null
  source_url?: string | null
  notes?: string | null
}

export type InvestmentFilters = {
  search: string
  typology: InvestmentTypology | 'all'
  status: InvestmentStatus | 'all'
  lawyerId: string | 'all' | 'none'
}

export const EMPTY_FILTERS: InvestmentFilters = {
  search: '',
  typology: 'all',
  status: 'all',
  lawyerId: 'all',
}
