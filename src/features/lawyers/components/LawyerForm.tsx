import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { toErrorMessage } from '@/lib/utils'
import type { Lawyer, LawyerInput } from '@/types/models'

interface FormState {
  name: string
  email: string
  phone: string
  office: string
  country: string
  notes: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

function toFormState(lawyer?: Lawyer | null): FormState {
  return {
    name: lawyer?.name ?? '',
    email: lawyer?.email ?? '',
    phone: lawyer?.phone ?? '',
    office: lawyer?.office ?? '',
    country: lawyer?.country ?? '',
    notes: lawyer?.notes ?? '',
  }
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.name.trim()) errors.name = 'A name is required.'
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Must be a valid email address.'
  }
  return errors
}

export interface LawyerFormProps {
  lawyer?: Lawyer | null
  submitting?: boolean
  submitLabel?: string
  onSubmit: (input: LawyerInput) => Promise<void> | void
  onCancel: () => void
}

export function LawyerForm({
  lawyer,
  submitting = false,
  submitLabel = 'Save lawyer',
  onSubmit,
  onCancel,
}: LawyerFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(lawyer))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        office: form.office.trim() || null,
        country: form.country.trim() || null,
        notes: form.notes.trim() || null,
      })
    } catch (error) {
      setSubmitError(toErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        required
        placeholder="e.g. Ana Martins"
        value={form.name}
        error={errors.name}
        onChange={(event) => set('name', event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          placeholder="ana@lawfirm.pt"
          value={form.email}
          error={errors.email}
          onChange={(event) => set('email', event.target.value)}
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="+351 …"
          value={form.phone}
          onChange={(event) => set('phone', event.target.value)}
        />
        <Input
          label="Office"
          placeholder="e.g. Lisboa"
          value={form.office}
          onChange={(event) => set('office', event.target.value)}
        />
        <Input
          label="Country"
          placeholder="e.g. Portugal"
          value={form.country}
          onChange={(event) => set('country', event.target.value)}
        />
      </div>
      <Textarea
        label="Notes"
        placeholder="Fees, availability, areas of expertise…"
        value={form.notes}
        onChange={(event) => set('notes', event.target.value)}
      />

      {submitError && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 ring-inset dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900">
          {submitError}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
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
