/** Tiny class-name joiner — avoids pulling in clsx/tailwind-merge. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

const currencyFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const preciseCurrencyFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const parsed = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(parsed)) return '—'
  return currencyFormatter.format(parsed)
}

export function formatCurrencyPrecise(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const parsed = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(parsed)) return '—'
  return preciseCurrencyFormatter.format(parsed)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium' }).format(new Date(value))
}

export function formatArea(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const parsed = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(parsed)) return '—'
  return `${parsed.toLocaleString('pt-PT')} m²`
}

/** Turns a Postgres/Supabase error into something a human can read. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') return message
  }
  return 'Something went wrong. Please try again.'
}

/**
 * Escapes a user string so it can be embedded in a PostgREST `or=()` filter.
 * PostgREST treats `,`, `(`, `)` and `%` as syntax, so we drop them.
 */
export function sanitizeSearchTerm(term: string): string {
  return term.replace(/[%,()\\]/g, ' ').trim()
}

/** `"12"` -> `12`, `""` -> `null`. Keeps optional numeric inputs honest. */
export function toNullableNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const parsed = typeof value === 'string' ? Number(value) : value
  return Number.isNaN(parsed) ? null : parsed
}
