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
  researching:
    'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  visiting: 'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-900',
  offer_made:
    'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900',
  due_diligence:
    'bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:ring-violet-900',
  purchased:
    'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900',
  sold: 'bg-teal-100 text-teal-700 ring-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:ring-teal-900',
  rejected:
    'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:ring-rose-900',
}

/** Columns the investments table can be sorted by. */
export const INVESTMENT_SORT_FIELDS = ['created_at', 'asking_price', 'expected_earnings'] as const
export type InvestmentSortField = (typeof INVESTMENT_SORT_FIELDS)[number]
export type SortDirection = 'asc' | 'desc'

export interface Lawyer {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  office: string | null
  country: string | null
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
  country?: string | null
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
  /** Free-text, debounced in the filter bar. Empty string = no bound. */
  minPrice: string
  maxPrice: string
  sort: InvestmentSortField
  direction: SortDirection
}

/** Filter state that actually narrows the result set (sorting is not a filter). */
export type InvestmentFilterCriteria = Pick<
  InvestmentFilters,
  'search' | 'typology' | 'status' | 'lawyerId' | 'minPrice' | 'maxPrice'
>

export const EMPTY_FILTERS: InvestmentFilters = {
  search: '',
  typology: 'all',
  status: 'all',
  lawyerId: 'all',
  minPrice: '',
  maxPrice: '',
  sort: 'created_at',
  direction: 'desc',
}

/** Lawyer filtering is done in memory — the directory is a small reference list. */
export type LawyerFilters = {
  search: string
  country: string | 'all'
}

export const EMPTY_LAWYER_FILTERS: LawyerFilters = {
  search: '',
  country: 'all',
}

/** Sort fields offered as clickable table headers, with their display labels. */
export const INVESTMENT_SORT_LABELS: Record<InvestmentSortField, string> = {
  created_at: 'Added',
  asking_price: 'Asking',
  expected_earnings: 'Expected',
}
