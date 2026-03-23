import { createAdminClient } from '@/lib/supabase/admin'
import { getAllDealsAdmin } from '@/lib/sharepoint'
import { BeraterStatusToggle } from './berater-status-toggle'

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

  const statusBadge = (status: string) => {
    switch (status) {
      case 'aktiv':
        return { bg: 'var(--success-light)', color: '#15803D' }
      case 'inaktiv':
        return { bg: 'var(--g100)', color: 'var(--g500)' }
      case 'gesperrt':
        return { bg: 'var(--danger-light)', color: '#B91C1C' }
      default:
        return { bg: 'var(--g100)', color: 'var(--g500)' }
    }
  }

  const rolleBadge = (rolle: string) => {
    switch (rolle) {
      case 'admin':
        return { bg: 'rgba(240,168,71,0.1)', color: '#f0a847' }
      case 'firmenberater':
        return { bg: 'var(--accent-light)', color: '#0E7490' }
      default:
        return { bg: '#EEF2FF', color: '#4338CA' }
    }
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-5" style={{ color: 'var(--g900)' }}>
        Berater verwalten
      </h1>

      <div
        className="bg-white overflow-hidden"
        style={{
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--g100)',
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--g100)' }}>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Name
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                E-Mail
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Rolle
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Status
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden md:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Registriert am
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden lg:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Deals
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Aktion
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => {
              const sBadge = statusBadge(u.status)
              const rBadge = rolleBadge(u.rolle)
              const userDeals = dealCounts[u.email?.toLowerCase() ?? ''] ?? 0
              return (
                <tr
                  key={u.id}
                  style={{ borderBottom: '1px solid var(--g50)' }}
                >
                  <td
                    className="px-4 py-3 text-sm font-semibold"
                    style={{ color: 'var(--g800)' }}
                  >
                    {u.name}
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden sm:table-cell"
                    style={{ color: 'var(--g500)' }}
                  >
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: rBadge.bg,
                        color: rBadge.color,
                      }}
                    >
                      {u.rolle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: sBadge.bg,
                        color: sBadge.color,
                      }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden md:table-cell"
                    style={{ color: 'var(--g400)' }}
                  >
                    {new Date(u.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-semibold hidden lg:table-cell"
                    style={{ color: 'var(--g700)' }}
                  >
                    {userDeals}
                  </td>
                  <td className="px-4 py-3">
                    <BeraterStatusToggle
                      userId={u.id}
                      currentStatus={u.status}
                    />
                  </td>
                </tr>
              )
            })}
            {(!users || users.length === 0) && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: 'var(--g400)' }}
                >
                  Keine Benutzer vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
