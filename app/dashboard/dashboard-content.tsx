import { createClient } from '@/lib/supabase/server'
import { getDealsByBerater } from '@/lib/sharepoint'
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

const PIPELINE_FILTERS = [
  { label: 'Alle', value: '' },
  { label: 'Neu', value: 'Neu' },
  { label: 'In Bearbeitung', value: 'In Bearbeitung' },
  { label: 'Angebot erstellt', value: 'Angebot erstellt' },
  { label: 'Gewonnen', value: 'Gewonnen' },
  { label: 'Verloren', value: 'Verloren' },
]

const PIPELINE_COLUMNS = [
  { status: 'Neu', label: 'Neu', color: '#4338CA', bg: '#EEF2FF' },
  { status: 'In Bearbeitung', label: 'In Bearbeitung', color: '#B45309', bg: 'var(--warning-light)' },
  { status: 'Angebot erstellt', label: 'Angebot erstellt', color: '#0E7490', bg: 'var(--accent-light)' },
  { status: 'Gewonnen', label: 'Gewonnen', color: '#15803D', bg: 'var(--success-light)' },
  { status: 'Verloren', label: 'Verloren', color: '#B91C1C', bg: 'var(--danger-light)' },
]

export default async function DashboardContent({
  status: activeFilter,
  view,
}: {
  status?: string
  view?: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const email = user.email ?? ''
  const allDeals = await getDealsByBerater(email)

  const isPipelineView = view === 'pipeline'

  const filteredDeals = activeFilter
    ? allDeals.filter(d => d.deal_status === activeFilter)
    : allDeals

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

      {/* Toolbar: Filter + View Toggle */}
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        {!isPipelineView ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {PIPELINE_FILTERS.map((filter) => {
              const isActive = (activeFilter ?? '') === filter.value
              return (
                <Link
                  key={filter.value}
                  href={filter.value ? `/dashboard?status=${encodeURIComponent(filter.value)}` : '/dashboard'}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    background: isActive ? 'var(--primary)' : 'white',
                    color: isActive ? 'white' : 'var(--g500)',
                    border: isActive ? '1.5px solid var(--primary)' : '1.5px solid var(--g200)',
                  }}
                >
                  {filter.label}
                </Link>
              )
            })}
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1" style={{ background: 'white', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--g200)', padding: 2 }}>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
            style={{
              background: !isPipelineView ? 'var(--g100)' : 'transparent',
              color: !isPipelineView ? 'var(--g700)' : 'var(--g400)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Liste
          </Link>
          <Link
            href="/dashboard?view=pipeline"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
            style={{
              background: isPipelineView ? 'var(--g100)' : 'transparent',
              color: isPipelineView ? 'var(--g700)' : 'var(--g400)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Pipeline
          </Link>
        </div>
      </div>

      {isPipelineView ? (
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ minHeight: 300 }}>
          {PIPELINE_COLUMNS.map((col) => {
            const colDeals = allDeals.filter(d => d.deal_status === col.status)
            return (
              <div key={col.status} className="shrink-0" style={{ width: 260 }}>
                <div
                  className="flex items-center justify-between px-3 py-2 mb-2 rounded-lg"
                  style={{ background: col.bg }}
                >
                  <span className="text-xs font-bold" style={{ color: col.color }}>{col.label}</span>
                  <span
                    className="flex items-center justify-center rounded-full text-[0.65rem] font-bold"
                    style={{ width: 20, height: 20, background: col.color, color: 'white' }}
                  >
                    {colDeals.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colDeals.map((deal) => (
                    <Link
                      key={deal.id}
                      href={`/dashboard/${deal.id}`}
                      className="block bg-white transition-all hover:shadow-sm"
                      style={{ borderRadius: 'var(--r-sm)', border: '1px solid var(--g100)', padding: '12px 14px' }}
                    >
                      <div className="text-sm font-semibold mb-1.5" style={{ color: 'var(--g800)' }}>{deal.Title}</div>
                      <div className="text-[0.7rem] mb-1" style={{ color: 'var(--g500)' }}>{deal.Interesse_an || '—'}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[0.68rem]" style={{ color: 'var(--g400)' }}>{deal.Deal_Besitzer || '—'}</span>
                        <span className="text-[0.68rem]" style={{ color: 'var(--g400)' }}>{deal.Created ? new Date(deal.Created).toLocaleDateString('de-DE') : ''}</span>
                      </div>
                    </Link>
                  ))}
                  {colDeals.length === 0 && (
                    <div className="text-center py-6 text-xs rounded-lg" style={{ color: 'var(--g300)', border: '1px dashed var(--g200)' }}>
                      Keine Deals
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <>
          {filteredDeals.length > 0 ? (
            <div className="bg-white overflow-hidden" style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--g100)' }}>
                    <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>Firma</th>
                    <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>Status</th>
                    <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--g400)' }}>Interesse</th>
                    <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--g400)' }}>Deal-Besitzer</th>
                    <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--g400)' }}>Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeals.map((deal) => (
                    <tr key={deal.id} className="transition-colors cursor-pointer" style={{ borderBottom: '1px solid var(--g50)' }}>
                      <td className="px-3.5 py-3">
                        <Link href={`/dashboard/${deal.id}`} className="text-sm font-semibold hover:underline" style={{ color: 'var(--primary)' }}>{deal.Title}</Link>
                      </td>
                      <td className="px-3.5 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-xl text-[0.72rem] font-bold ${STATUS_BADGES[deal.deal_status] ?? 'badge-neu'}`}>{deal.deal_status || '—'}</span>
                      </td>
                      <td className="px-3.5 py-3 text-xs hidden md:table-cell" style={{ color: 'var(--g500)' }}>{deal.Interesse_an || '—'}</td>
                      <td className="px-3.5 py-3 text-xs hidden sm:table-cell" style={{ color: 'var(--g500)' }}>{deal.Deal_Besitzer || '—'}</td>
                      <td className="px-3.5 py-3 text-xs hidden sm:table-cell" style={{ color: 'var(--g500)' }}>{deal.Created ? new Date(deal.Created).toLocaleDateString('de-DE') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white text-center py-12" style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}>
              <div className="text-sm" style={{ color: 'var(--g400)' }}>
                {activeFilter ? `Keine Deals mit Status "${activeFilter}".` : 'Noch keine Deals vorhanden.'}
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
