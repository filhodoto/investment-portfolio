import type { Lawyer, LawyerInput } from '@/types/models'

export interface LawyerFormState {
  name: string
  email: string
  phone: string
  office: string
  country: string
  notes: string
}

export type LawyerFormErrors = Partial<Record<keyof LawyerFormState, string>>

export function toLawyerFormState(lawyer?: Lawyer | null): LawyerFormState {
  return {
    name: lawyer?.name ?? '',
    email: lawyer?.email ?? '',
    phone: lawyer?.phone ?? '',
    office: lawyer?.office ?? '',
    country: lawyer?.country ?? '',
    notes: lawyer?.notes ?? '',
  }
}

export function validateLawyerForm(form: LawyerFormState): LawyerFormErrors {
  const errors: LawyerFormErrors = {}

  if (!form.name.trim()) errors.name = 'A name is required.'
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Must be a valid email address.'
  }

  return errors
}

/** Maps the form state onto the shape the service expects. */
export function toLawyerInput(form: LawyerFormState): LawyerInput {
  return {
    name: form.name.trim(),
    email: form.email.trim() || null,
    phone: form.phone.trim() || null,
    office: form.office.trim() || null,
    country: form.country.trim() || null,
    notes: form.notes.trim() || null,
  }
}
