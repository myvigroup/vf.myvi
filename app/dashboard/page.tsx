import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const STATUS_BADGES: Record<string, string> = {
  'Neu': 'badge-neu',
  'In Bearbeitung': 'badge-in-bearbeitung',
  'Angebot erstellt': 'badge-angebot-erstellt',
  'Gewonnen': 'badge-gewonnen',
  'Verloren': 'badge-verloren',
  'Storniert': 'badge-storniert',
}

const STAT_CARDS = [
  { key: 'total', label: 'GESAMT', color: 'var(--primary)', bg: 'var(--primary-light)', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'neu', label: 'NEU', color: '#4338CA', bg: '#EEF2FF', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { key: 'bearbeitung', label: 'IN BEARBEITUNG', color: '#B45309', bg: 'var(--warning-light)', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { key: 'gewonnen', label: 'GEWONNEN', color: '#15803D', bg: 'var(--success-light)', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
]

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deals } = await supabase
    .from('deals')
    .select('id, firma_name, deal_status, bereich, kontakt_email, erstellt_am')
    .order('erstellt_am', { ascending: false })

  const allDeals = deals ?? []
  const stats = {
    total: allDeals.length,
    neu: allDeals.filter(d => d.deal_status === 'Neu').length,
    bearbeitung: allDeals.filter(d => d.deal_status === 'In Bearbeitung').length,
    gewonnen: allDeals.filter(d => d.deal_status === 'Gewonnen').length,
  }

  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="flex items-center gap-3.5 bg-white cursor-pointer transition-all duration-200 hover:shadow-sm"
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--r-md)',
              border: '1.5px solid var(--g100)',
            }}
          >
            <div
              className="flex items-center justify-center rounded-lg shrink-0"
              style={{ width: 40, height: 40, background: card.bg }}
            >
              <svg
                width="20"
                height="20"
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
            <div>
              <div className="font-extrabold text-2xl" style={{ color: 'var(--g900)' }}>
                {stats[card.key as keyof typeof stats]}
              </div>
              <div
                className="text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Link
          href="/dashboard/deals/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-colors"
          style={{ background: 'var(--primary)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Neuer Deal
        </Link>
      </div>

      {/* Deals Table */}
      {allDeals.length > 0 ? (
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
                <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>
                  Firma
                </th>
                <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--g400)' }}>
                  Kontakt
                </th>
                <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--g400)' }}>
                  Bereich
                </th>
                <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>
                  Status
                </th>
                <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--g400)' }}>
                  Datum
                </th>
              </tr>
            </thead>
            <tbody>
              {allDeals.map((deal) => (
                <tr
                  key={deal.id}
                  className="transition-colors cursor-pointer"
                  style={{ borderBottom: '1px solid var(--g50)' }}
                >
                  <td className="px-3.5 py-3">
                    <Link
                      href={`/dashboard/deals/${deal.id}`}
                      className="text-sm font-semibold hover:underline"
                      style={{ color: 'var(--primary)' }}
                    >
                      {deal.firma_name}
                    </Link>
                  </td>
                  <td className="px-3.5 py-3 text-xs hidden sm:table-cell" style={{ color: 'var(--g500)' }}>
                    {deal.kontakt_email ?? '—'}
                  </td>
                  <td className="px-3.5 py-3 text-xs hidden md:table-cell" style={{ color: 'var(--g500)' }}>
                    {deal.bereich ?? '—'}
                  </td>
                  <td className="px-3.5 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-xl text-[0.72rem] font-bold ${STATUS_BADGES[deal.deal_status] ?? 'badge-neu'}`}
                    >
                      {deal.deal_status}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-xs hidden sm:table-cell" style={{ color: 'var(--g500)' }}>
                    {new Date(deal.erstellt_am).toLocaleDateString('de-DE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="bg-white text-center py-12"
          style={{
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--g100)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--g400)' }}>
            Noch keine Deals vorhanden.
          </div>
          <Link
            href="/dashboard/deals/new"
            className="mt-3 inline-block text-sm font-semibold"
            style={{ color: 'var(--primary)' }}
          >
            Ersten Deal einreichen &rarr;
          </Link>
        </div>
      )}
    </>
  )
}
