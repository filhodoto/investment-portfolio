import type { MortgageBroker, MortgageBrokerInput } from '@/types/models'

export interface MortgageBrokerFormState {
  name: string
  website: string
  country: string
  notes: string
}

export type MortgageBrokerFormErrors = Partial<Record<keyof MortgageBrokerFormState, string>>

export function toMortgageBrokerFormState(
  broker?: MortgageBroker | null,
): MortgageBrokerFormState {
  return {
    name: broker?.name ?? '',
    website: broker?.website ?? '',
    country: broker?.country ?? '',
    notes: broker?.notes ?? '',
  }
}

export function validateMortgageBrokerForm(
  form: MortgageBrokerFormState,
): MortgageBrokerFormErrors {
  const errors: MortgageBrokerFormErrors = {}

  if (!form.name.trim()) errors.name = 'A name is required.'

  if (form.website.trim() !== '') {
    try {
      new URL(form.website.trim())
    } catch {
      errors.website = 'Must be a valid URL (including https://).'
    }
  }

  return errors
}

/** Maps the form state onto the shape the service expects. */
export function toMortgageBrokerInput(form: MortgageBrokerFormState): MortgageBrokerInput {
  return {
    name: form.name.trim(),
    website: form.website.trim() || null,
    country: form.country.trim() || null,
    notes: form.notes.trim() || null,
  }
}
