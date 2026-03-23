import { createAdminClient } from '@/lib/supabase/admin'
import { getAllDealsAdmin } from '@/lib/sharepoint'

const STATUS_BADGES: Record<string, { bg: string; color: string }> = {
  'Neu': { bg: '#EEF2FF', color: '#4338CA' },
  'In Bearbeitung': { bg: 'var(--warning-light)', color: '#B45309' },
  'Angebot erstellt': { bg: 'var(--accent-light)', color: '#0E7490' },
  'Gewonnen': { bg: 'var(--success-light)', color: '#15803D' },
  'Verloren': { bg: 'var(--danger-light)', color: '#B91C1C' },
  'Storniert': { bg: 'var(--g100)', color: 'var(--g500)' },
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()
  const allDeals = await getAllDealsAdmin()

  // Only count deals from registered berater
  const { data: users } = await supabase.from('users').select('email')
  const registeredEmails = new Set((users ?? []).map(u => u.email.toLowerCase()))
  const deals = allDeals.filter(d => registeredEmails.has(d.Berater.toLowerCase()))

  // KPI calculations
  const totalDeals = deals.length
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const dealsThisWeek = deals.filter(
    (d) => new Date(d.Created) >= weekAgo
  ).length

  const { count: activeBerater } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'aktiv')
    .eq('rolle', 'berater')

  const openDeals = deals.filter(
    (d) => d.deal_status !== 'Gewonnen' && d.deal_status !== 'Verloren'
  ).length

  // Count total registered berater
  const { count: totalBerater } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const recentDeals = deals.slice(0, 10)

  const kpiCards = [
    {
      label: 'Deals gesamt',
      value: totalDeals,
      color: '#f0a847',
      bg: 'rgba(240,168,71,0.1)',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
    {
      label: 'Deals diese Woche',
      value: dealsThisWeek,
      color: '#4338CA',
      bg: '#EEF2FF',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      label: 'Aktive Berater',
      value: activeBerater ?? 0,
      color: '#15803D',
      bg: 'var(--success-light)',
      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8z',
    },
    {
      label: 'Offene Deals',
      value: openDeals,
      color: '#B45309',
      bg: 'var(--warning-light)',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      label: 'Registrierte Berater',
      value: totalBerater ?? 0,
      color: '#0E7490',
      bg: 'var(--accent-light)',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
  ]

  return (
    <>
      <h1 className="text-xl font-bold mb-5" style={{ color: 'var(--g900)' }}>
        Admin Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="bg-white"
            style={{
              padding: '20px 24px',
              borderRadius: 'var(--r-md)',
              border: '1.5px solid var(--g100)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{ width: 36, height: 36, background: card.bg }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={card.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={card.icon} />
                </svg>
              </div>
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: 'var(--g900)' }}
            >
              {card.value}
            </div>
            <div
              className="text-xs font-semibold uppercase tracking-wider mt-1"
              style={{ color: 'var(--g400)' }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--g700)' }}>
        Letzte Aktivitäten
      </h2>
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
                Firma
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Berater
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
                Datum
              </th>
            </tr>
          </thead>
          <tbody>
            {recentDeals.map((deal) => {
              const badge = STATUS_BADGES[deal.deal_status]
              return (
                <tr
                  key={deal.id}
                  style={{ borderBottom: '1px solid var(--g50)' }}
                >
                  <td
                    className="px-4 py-3 text-sm font-semibold"
                    style={{ color: 'var(--g800)' }}
                  >
                    {deal.Title}
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden sm:table-cell"
                    style={{ color: 'var(--g500)' }}
                  >
                    {deal.Berater}
                  </td>
                  <td className="px-4 py-3">
                    {badge ? (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          background: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {deal.deal_status}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--g400)' }}>
                        {deal.deal_status}
                      </span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden md:table-cell"
                    style={{ color: 'var(--g400)' }}
                  >
                    {new Date(deal.Created).toLocaleDateString('de-DE')}
                  </td>
                </tr>
              )
            })}
            {recentDeals.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: 'var(--g400)' }}
                >
                  Keine Deals vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
