import { toNullableNumber } from '@/lib/utils'
import type {
  Investment,
  InvestmentInput,
  InvestmentStatus,
  InvestmentTypology,
} from '@/types/models'

/** Form values are all strings — number/URL parsing happens on submit. */
export interface InvestmentFormState {
  title: string
  address: string
  city: string
  country: string
  typology: InvestmentTypology
  status: InvestmentStatus
  asking_price: string
  purchase_price: string
  expected_earnings: string
  area_sqm: string
  lawyer_id: string
  source_url: string
  notes: string
}

export type InvestmentFormErrors = Partial<Record<keyof InvestmentFormState, string>>

export function toInvestmentFormState(investment?: Investment | null): InvestmentFormState {
  return {
    title: investment?.title ?? '',
    address: investment?.address ?? '',
    city: investment?.city ?? '',
    country: investment?.country ?? 'Portugal',
    typology: investment?.typology ?? 'T2',
    status: investment?.status ?? 'researching',
    asking_price: investment?.asking_price?.toString() ?? '',
    purchase_price: investment?.purchase_price?.toString() ?? '',
    expected_earnings: investment?.expected_earnings?.toString() ?? '',
    area_sqm: investment?.area_sqm?.toString() ?? '',
    lawyer_id: investment?.lawyer_id ?? '',
    source_url: investment?.source_url ?? '',
    notes: investment?.notes ?? '',
  }
}

export function validateInvestmentForm(form: InvestmentFormState): InvestmentFormErrors {
  const errors: InvestmentFormErrors = {}

  if (!form.title.trim()) errors.title = 'A title is required.'

  for (const field of ['asking_price', 'purchase_price', 'expected_earnings', 'area_sqm'] as const) {
    const raw = form[field].trim()
    if (raw === '') continue
    const parsed = Number(raw)
    if (Number.isNaN(parsed)) {
      errors[field] = 'Must be a number.'
    } else if (parsed < 0) {
      errors[field] = 'Cannot be negative.'
    }
  }

  if (form.source_url.trim() !== '') {
    try {
      new URL(form.source_url.trim())
    } catch {
      errors.source_url = 'Must be a valid URL (including https://).'
    }
  }

  return errors
}

/** Maps the form state onto the shape the service expects. */
export function toInvestmentInput(form: InvestmentFormState): InvestmentInput {
  return {
    title: form.title.trim(),
    address: form.address.trim() || null,
    city: form.city.trim() || null,
    country: form.country.trim() || 'Portugal',
    typology: form.typology,
    status: form.status,
    asking_price: toNullableNumber(form.asking_price),
    purchase_price: toNullableNumber(form.purchase_price),
    expected_earnings: toNullableNumber(form.expected_earnings),
    area_sqm: toNullableNumber(form.area_sqm),
    lawyer_id: form.lawyer_id || null,
    source_url: form.source_url.trim() || null,
    notes: form.notes.trim() || null,
  }
}
