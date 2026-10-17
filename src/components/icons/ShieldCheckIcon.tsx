import type { IconProps } from '@/components/icons/types'

export function ShieldCheckIcon({ className = 'size-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.96 11.96 0 0 1 3.6 6.31c-.2.66-.3 1.35-.3 2.06 0 5.06 3.13 9.4 7.6 11.28 4.47-1.88 7.6-6.22 7.6-11.28 0-.71-.1-1.4-.3-2.06A11.96 11.96 0 0 1 12 2.714Z"
      />
    </svg>
  )
}
