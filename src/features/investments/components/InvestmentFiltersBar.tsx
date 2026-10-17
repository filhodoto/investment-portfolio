import { useEffect, useState } from 'react'

import { STATUS_FILTER_OPTIONS, TYPOLOGY_FILTER_OPTIONS } from '@/features/investments/constants'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  EMPTY_FILTERS,
  type InvestmentFilters,
  type InvestmentStatus,
  type InvestmentTypology,
  type Lawyer,
} from '@/types/models'

export interface InvestmentFiltersBarProps {
  filters: InvestmentFilters
  lawyers: Lawyer[]
  onChange: (patch: Partial<InvestmentFilters>) => void
}

const TEXT_CONTROL =
  'block w-full rounded-lg bg-white py-2 text-sm text-slate-900 shadow-xs ring-1 ring-slate-300 ring-inset ' +
  'placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none ' +
  'dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:placeholder:text-slate-500'

export function InvestmentFiltersBar({ filters, lawyers, onChange }: InvestmentFiltersBarProps) {
  const [search, setSearch] = useState(filters.search)
  const [minPrice, setMinPrice] = useState(filters.minPrice)
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice)

  const debouncedSearch = useDebouncedValue(search, 300)
  const debouncedMin = useDebouncedValue(minPrice, 400)
  const debouncedMax = useDebouncedValue(maxPrice, 400)

  // Push debounced values up, but only when they actually differ — avoids a
  // redundant refetch right after mount.
  useEffect(() => {
    if (debouncedSearch !== filters.search) onChange({ search: debouncedSearch })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  useEffect(() => {
    if (debouncedMin !== filters.minPrice) onChange({ minPrice: debouncedMin })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin])

  useEffect(() => {
    if (debouncedMax !== filters.maxPrice) onChange({ maxPrice: debouncedMax })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMax])

  // Keep local inputs in sync when filters are reset from the outside.
  useEffect(() => {
    setSearch(filters.search)
    setMinPrice(filters.minPrice)
    setMaxPrice(filters.maxPrice)
  }, [filters.search, filters.minPrice, filters.maxPrice])

  const lawyerOptions = [
    { value: 'all', label: 'All lawyers' },
    { value: 'none', label: 'No lawyer assigned' },
    ...lawyers.map((lawyer) => ({ value: lawyer.id, label: lawyer.name })),
  ]

  const hasCriteria =
    filters.search !== EMPTY_FILTERS.search ||
    filters.typology !== EMPTY_FILTERS.typology ||
    filters.status !== EMPTY_FILTERS.status ||
    filters.lawyerId !== EMPTY_FILTERS.lawyerId ||
    filters.minPrice !== '' ||
    filters.maxPrice !== ''

  const clearFilters = () => {
    // Only reset the criteria — the chosen sort order is not a filter.
    onChange({
      search: EMPTY_FILTERS.search,
      typology: EMPTY_FILTERS.typology,
      status: EMPTY_FILTERS.status,
      lawyerId: EMPTY_FILTERS.lawyerId,
      minPrice: '',
      maxPrice: '',
    })
  }

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:px-5 dark:border-slate-800">
      <div className="relative">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
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
          className={`${TEXT_CONTROL} pr-3 pl-9`}
        />
      </div>

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

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step="1000"
            inputMode="numeric"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Min asking €"
            aria-label="Minimum asking price"
            className={TEXT_CONTROL}
          />
          <span className="text-sm text-slate-400 dark:text-slate-500">–</span>
          <input
            type="number"
            min={0}
            step="1000"
            inputMode="numeric"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Max asking €"
            aria-label="Maximum asking price"
            className={TEXT_CONTROL}
          />
        </div>

        <div className="flex items-center sm:justify-end xl:col-span-2">
          <Button variant="ghost" size="sm" disabled={!hasCriteria} onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  )
}
