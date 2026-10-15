import { useState, type FormEvent } from 'react'

import {
  STATUS_SELECT_OPTIONS,
  TYPOLOGY_SELECT_OPTIONS,
} from '@/features/investments/constants'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { useLawyers } from '@/features/lawyers/hooks/useLawyers'
import { toNullableNumber, toErrorMessage } from '@/lib/utils'
import type { Investment, InvestmentInput, InvestmentStatus, InvestmentTypology } from '@/types/models'

interface FormState {
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

type FieldErrors = Partial<Record<keyof FormState, string>>

function toFormState(investment?: Investment | null): FormState {
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

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}

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

export interface InvestmentFormProps {
  investment?: Investment | null
  submitting?: boolean
  submitLabel?: string
  onSubmit: (input: InvestmentInput) => Promise<void> | void
  onCancel: () => void
}

export function InvestmentForm({
  investment,
  submitting = false,
  submitLabel = 'Save investment',
  onSubmit,
  onCancel,
}: InvestmentFormProps) {
  const { data: lawyers = [], isLoading: lawyersLoading } = useLawyers()
  const [form, setForm] = useState<FormState>(() => toFormState(investment))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const lawyerOptions = [
    { value: '', label: lawyersLoading ? 'Loading lawyers…' : 'No lawyer assigned' },
    ...lawyers.map((lawyer) => ({ value: lawyer.id, label: lawyer.name })),
  ]

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const input: InvestmentInput = {
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

    try {
      await onSubmit(input)
    } catch (error) {
      setSubmitError(toErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Title"
          required
          placeholder="e.g. Rua das Flores 12, 2º"
          value={form.title}
          error={errors.title}
          onChange={(event) => set('title', event.target.value)}
          containerClassName="sm:col-span-2"
        />
        <Input
          label="Address"
          placeholder="Street and number"
          value={form.address}
          onChange={(event) => set('address', event.target.value)}
        />
        <Input
          label="City"
          placeholder="e.g. Porto"
          value={form.city}
          onChange={(event) => set('city', event.target.value)}
        />
        <Input
          label="Country"
          value={form.country}
          onChange={(event) => set('country', event.target.value)}
        />
        <Select
          label="Typology"
          options={TYPOLOGY_SELECT_OPTIONS}
          value={form.typology}
          onChange={(event) => set('typology', event.target.value as InvestmentTypology)}
        />
        <Select
          label="Status"
          options={STATUS_SELECT_OPTIONS}
          value={form.status}
          onChange={(event) => set('status', event.target.value as InvestmentStatus)}
        />
        <Select
          label="Lawyer"
          options={lawyerOptions}
          value={form.lawyer_id}
          onChange={(event) => set('lawyer_id', event.target.value)}
        />
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-1 text-sm font-semibold text-slate-900">Numbers (EUR)</legend>
        <Input
          label="Asking price"
          type="number"
          min={0}
          step="0.01"
          placeholder="0"
          value={form.asking_price}
          error={errors.asking_price}
          onChange={(event) => set('asking_price', event.target.value)}
        />
        <Input
          label="Purchase price"
          type="number"
          min={0}
          step="0.01"
          placeholder="0"
          value={form.purchase_price}
          error={errors.purchase_price}
          onChange={(event) => set('purchase_price', event.target.value)}
        />
        <Input
          label="Expected earnings"
          type="number"
          min={0}
          step="0.01"
          placeholder="0"
          hint="What you expect to make on this deal."
          value={form.expected_earnings}
          error={errors.expected_earnings}
          onChange={(event) => set('expected_earnings', event.target.value)}
        />
        <Input
          label="Area (m²)"
          type="number"
          min={0}
          step="0.01"
          placeholder="0"
          value={form.area_sqm}
          error={errors.area_sqm}
          onChange={(event) => set('area_sqm', event.target.value)}
        />
      </fieldset>

      <Input
        label="Listing URL"
        type="url"
        placeholder="https://…"
        value={form.source_url}
        error={errors.source_url}
        onChange={(event) => set('source_url', event.target.value)}
      />

      <Textarea
        label="Notes"
        placeholder="Condition, refurbishment estimate, contacts, next steps…"
        value={form.notes}
        onChange={(event) => set('notes', event.target.value)}
      />

      {submitError && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 ring-inset">
          {submitError}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
