import { supabase } from '@/lib/supabaseClient'
import type { MortgageBroker, MortgageBrokerInput } from '@/types/models'

const TABLE = 'mortgage_brokers'

export async function listMortgageBrokers(): Promise<MortgageBroker[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('name', { ascending: true })
  if (error) throw error
  return (data ?? []) as MortgageBroker[]
}

export async function getMortgageBroker(id: string): Promise<MortgageBroker> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data as MortgageBroker
}

export async function createMortgageBroker(input: MortgageBrokerInput): Promise<MortgageBroker> {
  const { data, error } = await supabase.from(TABLE).insert(input).select('*').single()
  if (error) throw error
  return data as MortgageBroker
}

export async function updateMortgageBroker(
  id: string,
  input: MortgageBrokerInput,
): Promise<MortgageBroker> {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select('*').single()
  if (error) throw error
  return data as MortgageBroker
}

/** Mortgage brokers are a standalone directory, so deleting one is permanent. */
export async function deleteMortgageBroker(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
