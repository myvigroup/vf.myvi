import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Use admin client to bypass RLS when reading rolle
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('users')
    .select('rolle')
    .eq('id', user.id)
    .single()

  if (profile?.rolle !== 'admin') redirect('/dashboard')

  return { user, supabase }
}
