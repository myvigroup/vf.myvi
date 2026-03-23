import { getAllDealsAdmin } from '@/lib/sharepoint'
import { createAdminClient } from '@/lib/supabase/admin'
import { DealsTable } from './deals-table'

export default async function AdminDealsPage() {
  const [deals, registeredUsers] = await Promise.all([
    getAllDealsAdmin(),
    getRegisteredEmails(),
  ])

  // Only show deals from registered berater
  const registeredDeals = deals.filter(d =>
    registeredUsers.has(d.Berater.toLowerCase())
  )

  return (
    <>
      <h1 className="text-xl font-bold mb-5" style={{ color: 'var(--g900)' }}>
        Alle Deals
      </h1>
      <DealsTable deals={registeredDeals} />
    </>
  )
}

async function getRegisteredEmails(): Promise<Set<string>> {
  const supabase = createAdminClient()
  const { data: users } = await supabase
    .from('users')
    .select('email')

  return new Set((users ?? []).map(u => u.email.toLowerCase()))
}
