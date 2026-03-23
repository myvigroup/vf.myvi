import { createAdminClient } from '@/lib/supabase/admin'
import { getAllDealsAdmin } from '@/lib/sharepoint'
import { BeraterTable } from './berater-table'
import { ExcelImport } from './excel-import'

export default async function AdminBeraterPage() {
  const supabase = createAdminClient()

  const { data: users } = await supabase
    .from('users')
    .select('id, email, name, rolle, status, created_at')
    .order('created_at', { ascending: false })

  const deals = await getAllDealsAdmin()

  // Count deals per berater email
  const dealCounts: Record<string, number> = {}
  for (const deal of deals) {
    const email = deal.Berater.toLowerCase()
    dealCounts[email] = (dealCounts[email] || 0) + 1
  }

  return (
    <>
      <div
        className="mb-5"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h1 className="text-xl font-bold" style={{ color: 'var(--g900)' }}>
          Berater verwalten
        </h1>
        <ExcelImport />
      </div>

      <BeraterTable
        users={users ?? []}
        dealCounts={dealCounts}
      />
    </>
  )
}
