import { useState, type FormEvent } from 'react'

import { Alert } from '@/components/ui/Alert'
import { FormActions } from '@/components/ui/FormActions'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { STATUS_SELECT_OPTIONS, TYPOLOGY_SELECT_OPTIONS } from '@/features/investments/constants'
import {
  toInvestmentFormState,
  toInvestmentInput,
  validateInvestmentForm,
  type InvestmentFormErrors,
  type InvestmentFormState,
} from '@/features/investments/components/InvestmentForm/form'
import { useLawyers } from '@/features/lawyers/hooks/useLawyers'
import { toErrorMessage } from '@/lib/utils'
import type {
  Investment,
  InvestmentInput,
  InvestmentStatus,
  InvestmentTypology,
} from '@/types/models'

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
  const [form, setForm] = useState<InvestmentFormState>(() => toInvestmentFormState(investment))
  const [errors, setErrors] = useState<InvestmentFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const set = <K extends keyof InvestmentFormState>(key: K, value: InvestmentFormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const lawyerOptions = [
    { value: '', label: lawyersLoading ? 'Loading lawyers…' : 'No lawyer assigned' },
    ...lawyers.map((lawyer) => ({ value: lawyer.id, label: lawyer.name })),
  ]

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    const nextErrors = validateInvestmentForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      await onSubmit(toInvestmentInput(form))
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
        <legend className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Numbers (EUR)
        </legend>
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

      {submitError && <Alert>{submitError}</Alert>}

      <FormActions submitLabel={submitLabel} submitting={submitting} onCancel={onCancel} />
    </form>
  )
}
