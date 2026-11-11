import type { MortgageBroker, MortgageBrokerFilters } from '@/types/models'

/** Mortgage brokers are a small reference list, so filtering happens in memory. */
export function hasMortgageBrokerCriteria(filters: MortgageBrokerFilters): boolean {
  return filters.search !== '' || filters.country !== 'all'
}

export function filterMortgageBrokers(
  brokers: MortgageBroker[],
  filters: MortgageBrokerFilters,
): MortgageBroker[] {
  const term = filters.search.trim().toLowerCase()

  return brokers.filter((broker) => {
    if (filters.country !== 'all' && broker.country !== filters.country) return false
    if (!term) return true
    return broker.name.toLowerCase().includes(term)
  })
}

/** Distinct countries across every broker — powers the country dropdown. */
export function collectMortgageBrokerCountries(brokers: MortgageBroker[]): string[] {
  const seen = new Set<string>()
  for (const broker of brokers) {
    if (broker.country) seen.add(broker.country)
  }
  return [...seen].sort((a, b) => a.localeCompare(b))
}
