import type { IconProps } from '@/components/icons/types'

export function SearchIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 3.31 9.9l3.4 3.4a.75.75 0 1 0 1.06-1.06l-3.4-3.4A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
