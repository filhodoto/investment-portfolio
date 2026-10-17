import { Spinner } from '@/components/ui/Spinner/Spinner'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500 dark:text-slate-400">
      <Spinner />
      {label}
    </div>
  )
}
