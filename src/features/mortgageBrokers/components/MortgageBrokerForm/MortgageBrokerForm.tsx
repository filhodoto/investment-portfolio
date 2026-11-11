import { useState, type FormEvent } from 'react'

import { Alert } from '@/components/ui/Alert'
import { FormActions } from '@/components/ui/FormActions'
import { Input, Textarea } from '@/components/ui/Input'
import {
  toMortgageBrokerFormState,
  toMortgageBrokerInput,
  validateMortgageBrokerForm,
  type MortgageBrokerFormErrors,
  type MortgageBrokerFormState,
} from '@/features/mortgageBrokers/components/MortgageBrokerForm/form'
import { toErrorMessage } from '@/lib/utils'
import type { MortgageBroker, MortgageBrokerInput } from '@/types/models'

export interface MortgageBrokerFormProps {
  broker?: MortgageBroker | null
  submitting?: boolean
  submitLabel?: string
  onSubmit: (input: MortgageBrokerInput) => Promise<void> | void
  onCancel: () => void
}

export function MortgageBrokerForm({
  broker,
  submitting = false,
  submitLabel = 'Save mortgage broker',
  onSubmit,
  onCancel,
}: MortgageBrokerFormProps) {
  const [form, setForm] = useState<MortgageBrokerFormState>(() =>
    toMortgageBrokerFormState(broker),
  )
  const [errors, setErrors] = useState<MortgageBrokerFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const set = <K extends keyof MortgageBrokerFormState>(
    key: K,
    value: MortgageBrokerFormState[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    const nextErrors = validateMortgageBrokerForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      await onSubmit(toMortgageBrokerInput(form))
    } catch (error) {
      setSubmitError(toErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        required
        placeholder="e.g. Atlas Mortgages"
        value={form.name}
        error={errors.name}
        onChange={(event) => set('name', event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Website"
          type="url"
          placeholder="https://…"
          value={form.website}
          error={errors.website}
          onChange={(event) => set('website', event.target.value)}
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
        placeholder="Rates, fees, contacts, requirements…"
        value={form.notes}
        onChange={(event) => set('notes', event.target.value)}
      />

      {submitError && <Alert>{submitError}</Alert>}

      <FormActions submitLabel={submitLabel} submitting={submitting} onCancel={onCancel} />
    </form>
  )
}
