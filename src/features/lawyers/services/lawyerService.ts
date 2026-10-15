import { supabase } from '@/lib/supabaseClient'
import type { Lawyer, LawyerInput } from '@/types/models'

const TABLE = 'lawyers'

export async function listLawyers(): Promise<Lawyer[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('name', { ascending: true })
  if (error) throw error
  return (data ?? []) as Lawyer[]
}

export async function getLawyer(id: string): Promise<Lawyer> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data as Lawyer
}

export async function createLawyer(input: LawyerInput): Promise<Lawyer> {
  const { data, error } = await supabase.from(TABLE).insert(input).select('*').single()
  if (error) throw error
  return data as Lawyer
}

export async function updateLawyer(id: string, input: LawyerInput): Promise<Lawyer> {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select('*').single()
  if (error) throw error
  return data as Lawyer
}

/** Investments keep working after a lawyer is removed: the FK is `on delete set null`. */
export async function deleteLawyer(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
