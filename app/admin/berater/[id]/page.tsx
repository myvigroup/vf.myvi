import { createAdminClient } from '@/lib/supabase/admin'
import { getAllDealsAdmin } from '@/lib/sharepoint'
import Link from 'next/link'
import { notFound } from 'next/navigation'

function statusBadge(status: string) {
  switch (status) {
    case 'aktiv':
      return { bg: 'var(--success-light)', color: '#15803D' }
    case 'eingeladen':
      return { bg: '#EFF6FF', color: '#1D4ED8' }
    case 'inaktiv':
      return { bg: 'var(--g100)', color: 'var(--g500)' }
    case 'gesperrt':
      return { bg: 'var(--danger-light)', color: '#B91C1C' }
    default:
      return { bg: 'var(--g100)', color: 'var(--g500)' }
  }
}

function dealStatusBadge(status: string) {
  switch (status) {
    case 'Gewonnen':
      return { bg: 'var(--success-light)', color: '#15803D' }
    case 'Verloren':
    case 'Storniert':
      return { bg: 'var(--danger-light, #FEF2F2)', color: '#B91C1C' }
    case 'In Bearbeitung':
      return { bg: '#FFF7ED', color: '#C2410C' }
    case 'Angebot erstellt':
      return { bg: '#EFF6FF', color: '#1D4ED8' }
    case 'Neu':
      return { bg: 'var(--g100)', color: 'var(--g500)' }
    default:
      return { bg: 'var(--g100)', color: 'var(--g500)' }
  }
}

export default async function BeraterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: user } = await supabase
    .from('users')
    .select('id, email, name, vermittler_nr, rolle, status, created_at')
    .eq('id', id)
    .single()

  if (!user) {
    notFound()
  }

  const allDeals = await getAllDealsAdmin()
  const userDeals = allDeals.filter(
    (d) => d.Berater.toLowerCase() === (user.email?.toLowerCase() ?? '')
  )

  const sBadge = statusBadge(user.status)

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/berater"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--g500)',
            textDecoration: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Zurück zur Übersicht
        </Link>
      </div>

      <div
        className="bg-white"
        style={{
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--g100)',
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h1
          className="text-xl font-bold"
          style={{ color: 'var(--g900)', marginBottom: 16 }}
        >
          {user.name}
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          <div>
            <div
              style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--g400)', marginBottom: 4 }}
            >
              E-Mail
            </div>
            <div style={{ fontSize: 14, color: 'var(--g700)' }}>{user.email}</div>
          </div>

          <div>
            <div
              style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--g400)', marginBottom: 4 }}
            >
              Vermittler-Nr
            </div>
            <div style={{ fontSize: 14, color: 'var(--g700)' }}>
              {user.vermittler_nr || '—'}
            </div>
          </div>

          <div>
            <div
              style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--g400)', marginBottom: 4 }}
            >
              Status
            </div>
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
              {user.status}
            </span>
          </div>

          <div>
            <div
              style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--g400)', marginBottom: 4 }}
            >
              Rolle
            </div>
            <div style={{ fontSize: 14, color: 'var(--g700)' }}>{user.rolle}</div>
          </div>

          <div>
            <div
              style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--g400)', marginBottom: 4 }}
            >
              Registriert am
            </div>
            <div style={{ fontSize: 14, color: 'var(--g700)' }}>
              {new Date(user.created_at).toLocaleDateString('de-DE')}
            </div>
          </div>
        </div>
      </div>

      <h2
        className="text-lg font-bold mb-3"
        style={{ color: 'var(--g900)' }}
      >
        Deals ({userDeals.length})
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
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Status
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Interesse
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden md:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Deal-Besitzer
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
            {userDeals.map((deal) => {
              const dBadge = dealStatusBadge(deal.deal_status)
              return (
                <tr
                  key={deal.id}
                  style={{ borderBottom: '1px solid var(--g50)' }}
                >
                  <td className="px-4 py-3 text-sm font-semibold">
                    <Link
                      href={`/dashboard/${deal.id}`}
                      style={{
                        color: 'var(--primary)',
                        textDecoration: 'none',
                      }}
                    >
                      {deal.Title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: dBadge.bg,
                        color: dBadge.color,
                      }}
                    >
                      {deal.deal_status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden sm:table-cell"
                    style={{ color: 'var(--g500)' }}
                  >
                    {deal.Interesse_an}
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden md:table-cell"
                    style={{ color: 'var(--g500)' }}
                  >
                    {deal.Deal_Besitzer}
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
            {userDeals.length === 0 && (
              <tr>
                <td
                  colSpan={5}
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
