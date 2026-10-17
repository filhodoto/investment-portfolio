import { supabase } from '@/lib/supabaseClient'
import { sanitizeSearchTerm, toNullableNumber } from '@/lib/utils'
import type { Investment, InvestmentFilters, InvestmentInput } from '@/types/models'

const TABLE = 'investments'

/** Embeds the linked lawyer so lists can show the name without a second query. */
const SELECT = '*, lawyer:lawyers(id, name)'

export async function listInvestments(filters: InvestmentFilters): Promise<Investment[]> {
  let query = supabase.from(TABLE).select(SELECT)

  const term = sanitizeSearchTerm(filters.search)
  if (term) {
    query = query.or(`title.ilike.%${term}%,address.ilike.%${term}%,city.ilike.%${term}%`)
  }
  if (filters.typology !== 'all') {
    query = query.eq('typology', filters.typology)
  }
  if (filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters.lawyerId === 'none') {
    query = query.is('lawyer_id', null)
  } else if (filters.lawyerId !== 'all') {
    query = query.eq('lawyer_id', filters.lawyerId)
  }

  // Price range applies to the asking price. Rows without one are excluded,
  // which is the intuitive behaviour for "show me deals between X and Y".
  const minPrice = toNullableNumber(filters.minPrice)
  const maxPrice = toNullableNumber(filters.maxPrice)
  if (minPrice !== null) query = query.gte('asking_price', minPrice)
  if (maxPrice !== null) query = query.lte('asking_price', maxPrice)

  query = query.order(filters.sort, { ascending: filters.direction === 'asc' })
  // Stable tie-breaker so equal prices keep a predictable order.
  if (filters.sort !== 'created_at') {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Investment[]
}

export async function getInvestment(id: string): Promise<Investment> {
  const { data, error } = await supabase.from(TABLE).select(SELECT).eq('id', id).single()
  if (error) throw error
  return data as Investment
}

export async function createInvestment(input: InvestmentInput): Promise<Investment> {
  const { data, error } = await supabase.from(TABLE).insert(input).select(SELECT).single()
  if (error) throw error
  return data as Investment
}

export async function updateInvestment(id: string, input: InvestmentInput): Promise<Investment> {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select(SELECT).single()
  if (error) throw error
  return data as Investment
}

export async function deleteInvestment(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
