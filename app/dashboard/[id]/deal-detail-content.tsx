import { createClient } from '@/lib/supabase/server'
import { getDealById, getComments } from '@/lib/sharepoint'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import CommentForm from './comment-form'

const STATUS_BADGES: Record<string, string> = {
  'Neu': 'badge-neu',
  'In Bearbeitung': 'badge-in-bearbeitung',
  'Angebot erstellt': 'badge-angebot-erstellt',
  'Gewonnen': 'badge-gewonnen',
  'Verloren': 'badge-verloren',
  'Storniert': 'badge-storniert',
}

const FIELD_LABELS: { key: string; label: string }[] = [
  { key: 'Title', label: 'Firmenname' },
  { key: 'deal_status', label: 'Status' },
  { key: 'Interesse_an', label: 'Interesse an' },
  { key: 'Bereich', label: 'Bereich' },
  { key: 'Deal_Besitzer', label: 'Deal-Besitzer (Firmenberater)' },
  { key: 'Status_beauftragt', label: 'Status beauftragt' },
  { key: 'Created', label: 'Erstellt am' },
]

export default async function DealDetailContent({ id }: { id: string }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [deal, comments] = await Promise.all([
    getDealById(id),
    getComments(id),
  ])

  if (!deal) notFound()

  if (deal.Berater.toLowerCase() !== (user.email ?? '').toLowerCase()) {
    notFound()
  }

  return (
    <>
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold mb-4"
        style={{ color: 'var(--g400)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Zurück zur Übersicht
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--g900)' }}>
          {deal.Title}
        </h1>
        <span
          className={`inline-block px-2.5 py-0.5 rounded-xl text-[0.72rem] font-bold ${STATUS_BADGES[deal.deal_status] ?? 'badge-neu'}`}
        >
          {deal.deal_status || '—'}
        </span>
      </div>

      {/* Detail Card */}
      <div
        className="bg-white mb-4"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {FIELD_LABELS.map(({ key, label }) => {
            let value = deal[key] || '—'
            if (key === 'Created' && value !== '—') {
              value = new Date(value).toLocaleDateString('de-DE', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })
            }
            return (
              <div key={key} className="px-5 py-4" style={{ borderBottom: '1px solid var(--g50)' }}>
                <div className="text-[0.72rem] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--g400)' }}>
                  {label}
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--g800)' }}>
                  {key === 'deal_status' ? (
                    <span className={`inline-block px-2.5 py-0.5 rounded-xl text-[0.72rem] font-bold ${STATUS_BADGES[deal.deal_status] ?? 'badge-neu'}`}>
                      {deal.deal_status || '—'}
                    </span>
                  ) : value}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Kommentare */}
      <div className="bg-white" style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--g100)' }}>
          <div className="text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>
            Kommentare ({comments.length})
          </div>
        </div>

        {comments.length > 0 ? (
          <div>
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="px-5 py-3.5 flex gap-3"
                style={{
                  borderBottom: '1px solid var(--g50)',
                  background: comment.isVFBerater ? 'var(--primary-light)' : 'transparent',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    background: comment.isVFBerater ? 'var(--primary)' : 'var(--accent)',
                    marginTop: 2,
                  }}
                >
                  {comment.author.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: 'var(--g800)' }}>
                      {comment.author}
                    </span>
                    {comment.isVFBerater && (
                      <span
                        className="text-[0.62rem] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--primary)', color: 'white' }}
                      >
                        VF Berater
                      </span>
                    )}
                    <span className="text-[0.68rem]" style={{ color: 'var(--g400)' }}>
                      {new Date(comment.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="text-sm mt-0.5" style={{ color: 'var(--g600)' }}>{comment.text}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-6 text-center">
            <div className="text-sm" style={{ color: 'var(--g400)' }}>Noch keine Kommentare.</div>
          </div>
        )}

        <CommentForm dealId={deal.id} />
      </div>
    </>
  )
}
