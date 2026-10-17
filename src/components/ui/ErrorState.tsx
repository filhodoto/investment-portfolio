import { WarningIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400">
        <WarningIcon className="size-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        {description && (
          <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
