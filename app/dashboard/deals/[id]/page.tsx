import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { CommentForm } from './comment-form'

const STATUS_BADGES: Record<string, string> = {
  'Neu': 'badge-neu',
  'In Bearbeitung': 'badge-in-bearbeitung',
  'Angebot erstellt': 'badge-angebot-erstellt',
  'Gewonnen': 'badge-gewonnen',
  'Verloren': 'badge-verloren',
  'Storniert': 'badge-storniert',
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deal, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !deal) notFound()

  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('deal_id', id)
    .order('created_at', { ascending: true })

  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .eq('deal_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  const badgeClass = STATUS_BADGES[deal.deal_status] ?? 'badge-neu'

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-xs font-semibold mb-4"
        style={{ color: 'var(--g400)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Zurück
      </Link>

      {/* Header Card */}
      <div
        className="bg-white p-5 mb-4 flex items-start justify-between"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      >
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--g900)' }}>
            {deal.firma_name}
          </h1>
          <p className="mt-1 text-xs" style={{ color: 'var(--g400)' }}>
            Eingereicht am{' '}
            {new Date(deal.erstellt_am).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
            {deal.berater_name && ` · ${deal.berater_name}`}
          </p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-xl text-[0.72rem] font-bold ${badgeClass}`}>
          {deal.deal_status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Details + Comments */}
        <div className="lg:col-span-2 space-y-4">
          {/* Details */}
          <div
            className="bg-white"
            style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
          >
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--g100)' }}>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>
                Details
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--g50)' }}>
              {[
                { label: 'Kontakt E-Mail', value: deal.kontakt_email },
                { label: 'Telefon', value: [deal.telefonnummer, deal.telefonnummer_2].filter(Boolean).join(' / ') || null },
                { label: 'Bereich', value: deal.bereich },
                { label: 'Interesse an', value: deal.interesse_an },
                { label: 'Deal-Besitzer', value: deal.deal_besitzer },
                { label: 'Notizen', value: deal.notizen },
              ]
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label} className="px-5 py-3 flex gap-4">
                    <dt className="text-xs font-semibold shrink-0 w-32" style={{ color: 'var(--g400)' }}>
                      {row.label}
                    </dt>
                    <dd className="text-sm whitespace-pre-wrap" style={{ color: 'var(--g700)' }}>
                      {row.value}
                    </dd>
                  </div>
                ))}
            </div>
          </div>

          {/* Comments */}
          <div
            className="bg-white"
            style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
          >
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--g100)' }}>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>
                Kommentare ({comments?.length ?? 0})
              </h2>
            </div>
            <div className="p-5 space-y-3">
              {comments && comments.length > 0 ? (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-lg"
                    style={{ background: 'var(--g50)', border: '1px solid var(--g100)' }}
                  >
                    <div className="flex items-center gap-2 text-xs mb-1.5">
                      <span className="font-semibold" style={{ color: 'var(--g700)' }}>
                        {c.autor_name}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[0.68rem] font-semibold"
                        style={{ background: 'var(--g100)', color: 'var(--g500)' }}
                      >
                        {c.autor_rolle}
                      </span>
                      {c.quelle === 'sharepoint' && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[0.68rem] font-semibold"
                          style={{ background: '#F3E8FF', color: '#7C3AED' }}
                        >
                          SharePoint
                        </span>
                      )}
                      <span style={{ color: 'var(--g400)' }}>
                        {new Date(c.created_at).toLocaleString('de-DE')}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--g700)' }}>
                      {c.inhalt}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs" style={{ color: 'var(--g400)' }}>
                  Noch keine Kommentare.
                </p>
              )}

              <CommentForm dealId={deal.id} />
            </div>
          </div>
        </div>

        {/* Right: Activity Timeline */}
        <div>
          <div
            className="bg-white"
            style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
          >
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--g100)' }}>
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>
                Aktivitäten
              </h2>
            </div>
            <div className="p-5">
              {activities && activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((a, i) => (
                    <div key={a.id} className="flex gap-3">
                      {/* Timeline dot + line */}
                      <div className="flex flex-col items-center">
                        <div
                          className="rounded-full shrink-0"
                          style={{
                            width: 8,
                            height: 8,
                            marginTop: 4,
                            background:
                              a.typ === 'erstellt'
                                ? 'var(--success)'
                                : a.typ === 'status_aenderung'
                                ? 'var(--warning)'
                                : 'var(--primary)',
                          }}
                        />
                        {i < activities.length - 1 && (
                          <div
                            className="flex-1"
                            style={{ width: 1, background: 'var(--g200)', marginTop: 4 }}
                          />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-xs" style={{ color: 'var(--g700)' }}>
                          {a.beschreibung}
                        </p>
                        <p className="text-[0.68rem] mt-0.5" style={{ color: 'var(--g400)' }}>
                          {new Date(a.created_at).toLocaleString('de-DE')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs" style={{ color: 'var(--g400)' }}>
                  Keine Aktivitäten.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
