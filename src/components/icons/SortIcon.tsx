import type { IconProps } from '@/components/icons/types'

export function SortIcon({ className = 'size-3.5' }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 3a.75.75 0 0 1 .55.24l3.25 3.5a.75.75 0 1 1-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 0 1-1.1-1.02l3.25-3.5A.75.75 0 0 1 10 3Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M10 17a.75.75 0 0 1-.55-.24l-3.25-3.5a.75.75 0 1 1 1.1-1.02L10 15.148l2.7-2.908a.75.75 0 1 1 1.1 1.02l-3.25 3.5A.75.75 0 0 1 10 17Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
