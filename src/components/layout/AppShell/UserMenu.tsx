import { SignOutButton } from '@/features/auth/components/SignOutButton'
import { useAuth } from '@/features/auth/hooks/useAuth'

/** Signed-in identity plus the sign-out action, for the desktop sidebar. */
export function UserMenu() {
  const { user } = useAuth()

  return (
    <div>
      <p
        className="truncate px-2 text-xs text-slate-500 dark:text-slate-400"
        title={user?.email ?? ''}
      >
        {user?.email}
      </p>
      <SignOutButton className="mt-1 w-full justify-start" />
    </div>
  )
}
