import { useMemo } from 'react'

import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { SearchInput } from '@/components/ui/SearchInput'
import { PriceRangeFilter } from '@/features/investments/components/InvestmentFiltersBar/PriceRangeFilter'
import { STATUS_FILTER_OPTIONS, TYPOLOGY_FILTER_OPTIONS } from '@/features/investments/constants'
import { clearInvestmentCriteria, hasInvestmentCriteria } from '@/features/investments/filters'
import type {
  InvestmentFilters,
  InvestmentStatus,
  InvestmentTypology,
  Lawyer,
} from '@/types/models'

export interface InvestmentFiltersBarProps {
  filters: InvestmentFilters
  lawyers: Lawyer[]
  onChange: (patch: Partial<InvestmentFilters>) => void
}

/**
 * Fully controlled: the parent owns the filter state, so the debounce lives in
 * `useInvestmentQueryFilters` and this component needs no effects at all.
 */
export function InvestmentFiltersBar({ filters, lawyers, onChange }: InvestmentFiltersBarProps) {
  const lawyerOptions = useMemo(
    () => [
      { value: 'all', label: 'All lawyers' },
      { value: 'none', label: 'No lawyer assigned' },
      ...lawyers.map((lawyer) => ({ value: lawyer.id, label: lawyer.name })),
    ],
    [lawyers],
  )

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:px-5 dark:border-slate-800">
      <SearchInput
        value={filters.search}
        onChange={(search) => onChange({ search })}
        placeholder="Search by title, address or city…"
        aria-label="Search investments"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Select
          label="Status"
          options={STATUS_FILTER_OPTIONS}
          value={filters.status}
          onChange={(event) => onChange({ status: event.target.value as InvestmentStatus | 'all' })}
          hideLabel
        />
        <Select
          label="Typology"
          options={TYPOLOGY_FILTER_OPTIONS}
          value={filters.typology}
          onChange={(event) =>
            onChange({ typology: event.target.value as InvestmentTypology | 'all' })
          }
          hideLabel
        />
        <Select
          label="Lawyer"
          options={lawyerOptions}
          value={filters.lawyerId}
          onChange={(event) => onChange({ lawyerId: event.target.value })}
          hideLabel
        />

        <PriceRangeFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={onChange}
        />

        <div className="flex items-center sm:justify-end xl:col-span-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasInvestmentCriteria(filters)}
            onClick={() => onChange(clearInvestmentCriteria())}
          >
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  )
}
