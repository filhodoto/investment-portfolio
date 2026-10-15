import { useEffect, useState } from 'react'

import {
  STATUS_FILTER_OPTIONS,
  TYPOLOGY_FILTER_OPTIONS,
} from '@/features/investments/constants'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { EMPTY_FILTERS, type InvestmentFilters, type InvestmentStatus, type InvestmentTypology, type Lawyer } from '@/types/models'

export interface InvestmentFiltersBarProps {
  filters: InvestmentFilters
  lawyers: Lawyer[]
  onChange: (patch: Partial<InvestmentFilters>) => void
}

export function InvestmentFiltersBar({ filters, lawyers, onChange }: InvestmentFiltersBarProps) {
  const [search, setSearch] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(search, 300)

  // Push the debounced term up, but only when it actually differs — avoids a
  // redundant refetch right after mount.
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onChange({ search: debouncedSearch })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  // Keep the input in sync when filters are reset from the outside.
  useEffect(() => {
    setSearch(filters.search)
  }, [filters.search])

  const lawyerOptions = [
    { value: 'all', label: 'All lawyers' },
    { value: 'none', label: 'No lawyer assigned' },
    ...lawyers.map((lawyer) => ({ value: lawyer.id, label: lawyer.name })),
  ]

  const isFiltered =
    filters.search !== '' ||
    filters.typology !== 'all' ||
    filters.status !== 'all' ||
    filters.lawyerId !== 'all'

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
      <div className="relative">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 3.31 9.9l3.4 3.4a.75.75 0 1 0 1.06-1.06l-3.4-3.4A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title, address or city…"
          aria-label="Search investments"
          className="block w-full rounded-lg bg-white py-2 pr-3 pl-9 text-sm text-slate-900 shadow-xs ring-1 ring-slate-300 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
          onChange={(event) => onChange({ typology: event.target.value as InvestmentTypology | 'all' })}
          hideLabel
        />
        <Select
          label="Lawyer"
          options={lawyerOptions}
          value={filters.lawyerId}
          onChange={(event) => onChange({ lawyerId: event.target.value })}
          hideLabel
        />
        <div className="flex items-center sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            disabled={!isFiltered}
            onClick={() => onChange({ ...EMPTY_FILTERS })}
          >
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  )
}
