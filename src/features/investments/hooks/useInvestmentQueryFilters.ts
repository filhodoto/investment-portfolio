import { useMemo } from 'react'

import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { InvestmentFilters } from '@/types/models'

/**
 * Filters to hand to the query. Only the criteria that produce network
 * round-trips (free-text search and the price bounds) are debounced, so select
 * changes and column sorting still apply instantly.
 */
export function useInvestmentQueryFilters(filters: InvestmentFilters, delay = 350): InvestmentFilters {
  // Memoised on primitives so an unrelated re-render does not restart the timer.
  const textCriteria = useMemo(
    () => ({ search: filters.search, minPrice: filters.minPrice, maxPrice: filters.maxPrice }),
    [filters.search, filters.minPrice, filters.maxPrice],
  )

  const debouncedTextCriteria = useDebouncedValue(textCriteria, delay)

  return useMemo(() => ({ ...filters, ...debouncedTextCriteria }), [filters, debouncedTextCriteria])
}
