import type { Investment, Lawyer, LawyerFilters } from '@/types/models'

/** Lawyer filtering happens in memory — the directory is a small reference list. */
export function hasLawyerCriteria(filters: LawyerFilters): boolean {
  return filters.search !== '' || filters.country !== 'all'
}

export function filterLawyers(lawyers: Lawyer[], filters: LawyerFilters): Lawyer[] {
  const term = filters.search.trim().toLowerCase()

  return lawyers.filter((lawyer) => {
    if (filters.country !== 'all' && lawyer.country !== filters.country) return false
    if (!term) return true

    const haystack: Array<string | null> = [
      lawyer.name,
      lawyer.email,
      lawyer.office,
      lawyer.phone,
      lawyer.country,
    ]
    return haystack.some((value) => value !== null && value.toLowerCase().includes(term))
  })
}

/** Distinct countries across every lawyer — powers the country dropdown. */
export function collectLawyerCountries(lawyers: Lawyer[]): string[] {
  const seen = new Set<string>()
  for (const lawyer of lawyers) {
    if (lawyer.country) seen.add(lawyer.country)
  }
  return [...seen].sort((a, b) => a.localeCompare(b))
}

/** lawyer id -> number of investments linked to them. */
export function countInvestmentsByLawyer(investments: Investment[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const investment of investments) {
    if (!investment.lawyer_id) continue
    counts.set(investment.lawyer_id, (counts.get(investment.lawyer_id) ?? 0) + 1)
  }
  return counts
}
