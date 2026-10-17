import { createClient } from '@supabase/supabase-js'

import { env } from '@/lib/env'
import type { Database } from '@/types/database.types'

/**
 * Single shared Supabase client.
 *
 * Importing this module everywhere guarantees one auth session, one realtime
 * connection and one refresh timer for the whole app.
 *
 * The generated `Database` type makes every query column-aware: a typo in a
 * table or column name becomes a compile error instead of a runtime 400.
 * Regenerate it with `npm run db:types` after a migration.
 */
export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
