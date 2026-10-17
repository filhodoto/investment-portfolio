import { Button } from '@/components/ui/Button'

export interface FormActionsProps {
  submitLabel: string
  onCancel: () => void
  submitting?: boolean
  cancelLabel?: string
}

/** Cancel + submit footer shared by every form. */
export function FormActions({
  submitLabel,
  onCancel,
  submitting = false,
  cancelLabel = 'Cancel',
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
      <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
        {cancelLabel}
      </Button>
      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </div>
  )
}
