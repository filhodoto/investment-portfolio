import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'

/** Sign-out affordance, reused by the desktop sidebar and the mobile top bar. */
export function SignOutButton({ className }: { className?: string }) {
  const { signOut } = useAuth()

  return (
    <Button variant="ghost" size="sm" className={className} onClick={() => void signOut()}>
      Sign out
    </Button>
  )
}
