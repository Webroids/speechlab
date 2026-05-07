import 'client-only'
import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/db'

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Browser client uses anon key — but for this single-user app there's no auth.
  // We only use it for reading signed storage URLs; all writes go through server actions.
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  return createClient<Database>(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '', {
    auth: { persistSession: false },
  })
}
