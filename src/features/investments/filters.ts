import { EMPTY_FILTERS, type InvestmentFilterCriteria, type InvestmentFilters } from '@/types/models'

/** The criteria a "Clear filters" action resets. Sorting is intentionally excluded. */
const EMPTY_CRITERIA: InvestmentFilterCriteria = {
  search: EMPTY_FILTERS.search,
  typology: EMPTY_FILTERS.typology,
  status: EMPTY_FILTERS.status,
  lawyerId: EMPTY_FILTERS.lawyerId,
  minPrice: EMPTY_FILTERS.minPrice,
  maxPrice: EMPTY_FILTERS.maxPrice,
}

/** A patch that resets every filter criterion while preserving the chosen sort. */
export function clearInvestmentCriteria(): Partial<InvestmentFilters> {
  return { ...EMPTY_CRITERIA }
}

export function hasInvestmentCriteria(filters: InvestmentFilters): boolean {
  return (
    filters.search !== EMPTY_CRITERIA.search ||
    filters.typology !== EMPTY_CRITERIA.typology ||
    filters.status !== EMPTY_CRITERIA.status ||
    filters.lawyerId !== EMPTY_CRITERIA.lawyerId ||
    filters.minPrice !== EMPTY_CRITERIA.minPrice ||
    filters.maxPrice !== EMPTY_CRITERIA.maxPrice
  )
}
