import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}
