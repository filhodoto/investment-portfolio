import { useState, type FormEvent } from 'react'

import { Alert } from '@/components/ui/Alert'
import { FormActions } from '@/components/ui/FormActions'
import { Input, Textarea } from '@/components/ui/Input'
import {
  toLawyerFormState,
  toLawyerInput,
  validateLawyerForm,
  type LawyerFormErrors,
  type LawyerFormState,
} from '@/features/lawyers/components/LawyerForm/form'
import { toErrorMessage } from '@/lib/utils'
import type { Lawyer, LawyerInput } from '@/types/models'

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
  const [form, setForm] = useState<LawyerFormState>(() => toLawyerFormState(lawyer))
  const [errors, setErrors] = useState<LawyerFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const set = <K extends keyof LawyerFormState>(key: K, value: LawyerFormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    const nextErrors = validateLawyerForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      await onSubmit(toLawyerInput(form))
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

      {submitError && <Alert>{submitError}</Alert>}

      <FormActions submitLabel={submitLabel} submitting={submitting} onCancel={onCancel} />
    </form>
  )
}
