import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { CommentForm } from './comment-form'

const STATUS_COLORS: Record<string, string> = {
  'Neu': 'bg-gray-100 text-gray-700',
  'In Bearbeitung': 'bg-blue-50 text-blue-700',
  'Angebot erstellt': 'bg-yellow-50 text-yellow-700',
  'Gewonnen': 'bg-green-50 text-green-700',
  'Verloren': 'bg-red-50 text-red-700',
  'Storniert': 'bg-gray-100 text-gray-500',
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

  const statusColor = STATUS_COLORS[deal.deal_status] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/dashboard"
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; Zurück zum Dashboard
      </Link>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{deal.firma_name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Eingereicht am{' '}
            {new Date(deal.erstellt_am).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
        >
          {deal.deal_status}
        </span>
      </div>

      {/* Details */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white">
        <dl className="divide-y divide-gray-200">
          {deal.kontakt_email && (
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Kontakt E-Mail</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{deal.kontakt_email}</dd>
            </div>
          )}
          {deal.telefonnummer && (
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Telefon</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                {deal.telefonnummer}
                {deal.telefonnummer_2 && ` / ${deal.telefonnummer_2}`}
              </dd>
            </div>
          )}
          {deal.bereich && (
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Bereich</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{deal.bereich}</dd>
            </div>
          )}
          {deal.interesse_an && (
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Interesse an</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{deal.interesse_an}</dd>
            </div>
          )}
          {deal.deal_besitzer && (
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Deal-Besitzer</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{deal.deal_besitzer}</dd>
            </div>
          )}
          {deal.notizen && (
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Notizen</dt>
              <dd className="mt-1 text-sm whitespace-pre-wrap sm:col-span-2 sm:mt-0">
                {deal.notizen}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Kommentare */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Kommentare</h2>

        {comments && comments.length > 0 ? (
          <div className="mt-4 space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{c.autor_name}</span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {c.autor_rolle}
                  </span>
                  {c.quelle === 'sharepoint' && (
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600">
                      SharePoint
                    </span>
                  )}
                  <span className="text-gray-400">
                    {new Date(c.created_at).toLocaleString('de-DE')}
                  </span>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">{c.inhalt}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-400">Noch keine Kommentare.</p>
        )}

        <div className="mt-4">
          <CommentForm dealId={deal.id} />
        </div>
      </div>

      {/* Aktivitäten */}
      {activities && activities.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Aktivitäten</h2>
          <div className="mt-4 space-y-2">
            {activities.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 text-sm text-gray-600"
              >
                <span className="shrink-0 text-xs text-gray-400 pt-0.5">
                  {new Date(a.created_at).toLocaleString('de-DE')}
                </span>
                <span>{a.beschreibung}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
