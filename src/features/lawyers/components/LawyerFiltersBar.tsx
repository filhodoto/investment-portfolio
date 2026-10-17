import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { SearchInput } from '@/components/ui/SearchInput'
import { hasLawyerCriteria } from '@/features/lawyers/filters'
import { EMPTY_LAWYER_FILTERS, type LawyerFilters } from '@/types/models'

export interface LawyerFiltersBarProps {
  filters: LawyerFilters
  countries: string[]
  onChange: (patch: Partial<LawyerFilters>) => void
}

/**
 * Lawyers are a small reference list, so filtering happens in memory on the
 * already-loaded rows (see LawyersPage) rather than round-tripping to Postgres.
 */
export function LawyerFiltersBar({ filters, countries, onChange }: LawyerFiltersBarProps) {
  const countryOptions = [
    { value: 'all', label: 'All countries' },
    ...countries.map((country) => ({ value: country, label: country })),
  ]

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:px-5 dark:border-slate-800">
      <SearchInput
        className="sm:flex-1"
        value={filters.search}
        onChange={(search) => onChange({ search })}
        placeholder="Search by name, email, phone or office…"
        aria-label="Search lawyers"
      />

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
          disabled={!hasLawyerCriteria(filters)}
          onClick={() => onChange({ ...EMPTY_LAWYER_FILTERS })}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
