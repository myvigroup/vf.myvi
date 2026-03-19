import { createClient } from '@supabase/supabase-js'

// Service-Role-Client für API-Routen (umgeht RLS)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
