import {
  INVESTMENT_STATUS_LABELS,
  INVESTMENT_STATUSES,
  INVESTMENT_TYPOLOGIES,
} from '@/types/models'

/** Options for a `required` select — no "all" entry. */
export const STATUS_SELECT_OPTIONS = INVESTMENT_STATUSES.map((status) => ({
  value: status,
  label: INVESTMENT_STATUS_LABELS[status],
}))

export const TYPOLOGY_SELECT_OPTIONS = INVESTMENT_TYPOLOGIES.map((typology) => ({
  value: typology,
  label: typology,
}))

/** Options for the filter bar, with an explicit "all" entry. */
export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  ...STATUS_SELECT_OPTIONS,
]

export const TYPOLOGY_FILTER_OPTIONS = [
  { value: 'all', label: 'All typologies' },
  ...TYPOLOGY_SELECT_OPTIONS,
]
