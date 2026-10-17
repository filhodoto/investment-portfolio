import type { IconProps } from '@/components/icons/types'

export function WarningIcon({ className = 'size-6' }: IconProps) {
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
        d="M12 9v3.75m0 3.75h.008M10.34 3.94l-8.4 14.55A1.5 1.5 0 0 0 3.25 21h17.5a1.5 1.5 0 0 0 1.3-2.25l-8.4-14.55a1.5 1.5 0 0 0-2.6 0Z"
      />
    </svg>
  )
}
