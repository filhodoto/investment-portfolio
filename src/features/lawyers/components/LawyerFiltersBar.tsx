import { Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EMPTY_LAWYER_FILTERS, type LawyerFilters } from '@/types/models'

export interface LawyerFiltersBarProps {
  filters: LawyerFilters
  countries: string[]
  onChange: (patch: Partial<LawyerFilters>) => void
}

const TEXT_CONTROL =
  'block w-full rounded-lg bg-white py-2 text-sm text-slate-900 shadow-xs ring-1 ring-slate-300 ring-inset ' +
  'placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none ' +
  'dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:placeholder:text-slate-500'

/**
 * Lawyers are a small reference list, so filtering happens in memory on the
 * already-loaded rows (see LawyersPage) rather than round-tripping to Postgres.
 */
export function LawyerFiltersBar({ filters, countries, onChange }: LawyerFiltersBarProps) {
  const countryOptions = [
    { value: 'all', label: 'All countries' },
    ...countries.map((country) => ({ value: country, label: country })),
  ]

  const hasCriteria = filters.search !== '' || filters.country !== 'all'

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:px-5 dark:border-slate-800">
      <div className="relative sm:flex-1">
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
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search by name, email, phone or office…"
          aria-label="Search lawyers"
          className={`${TEXT_CONTROL} pr-3 pl-9`}
        />
      </div>

      <div className="flex items-center gap-2 sm:w-64">
        <Select
          label="Country"
          options={countryOptions}
          value={filters.country}
          onChange={(event) => onChange({ country: event.target.value })}
          hideLabel
          containerClassName="flex-1"
        />
        <Button
          variant="ghost"
          size="sm"
          disabled={!hasCriteria}
          onClick={() => onChange({ ...EMPTY_LAWYER_FILTERS })}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
