import { createClient } from '@supabase/supabase-js'

import { env } from '@/lib/env'

/**
 * Single shared Supabase client.
 *
 * Importing this module everywhere guarantees one auth session, one realtime
 * connection and one refresh timer for the whole app.
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
