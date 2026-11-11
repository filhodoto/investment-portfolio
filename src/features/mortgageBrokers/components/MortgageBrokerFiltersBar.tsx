import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { SearchInput } from '@/components/ui/SearchInput'
import { hasMortgageBrokerCriteria } from '@/features/mortgageBrokers/filters'
import { EMPTY_MORTGAGE_BROKER_FILTERS, type MortgageBrokerFilters } from '@/types/models'

export interface MortgageBrokerFiltersBarProps {
  filters: MortgageBrokerFilters
  countries: string[]
  onChange: (patch: Partial<MortgageBrokerFilters>) => void
}

/**
 * Like lawyers, mortgage brokers are a small reference list, so filtering
 * happens in memory on the already-loaded rows (see MortgageBrokersPage).
 */
export function MortgageBrokerFiltersBar({
  filters,
  countries,
  onChange,
}: MortgageBrokerFiltersBarProps) {
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
        placeholder="Search by name…"
        aria-label="Search mortgage brokers"
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
          disabled={!hasMortgageBrokerCriteria(filters)}
          onClick={() => onChange({ ...EMPTY_MORTGAGE_BROKER_FILTERS })}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
