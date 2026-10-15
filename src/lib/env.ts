/**
 * Validated access to Vite environment variables.
 *
 * Vite only exposes variables prefixed with `VITE_`, which is why the anon key
 * is safe to ship: it is designed to be public and Row Level Security is what
 * actually protects the data. The `service_role` key must never appear here.
 */

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

/** True when `.env.local` has been filled in. Used to render a setup screen. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const env = {
  supabaseUrl: supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey: supabaseAnonKey || 'public-anon-key-not-configured',
}
