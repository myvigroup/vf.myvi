import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  'Neu': 'bg-gray-100 text-gray-700',
  'In Bearbeitung': 'bg-blue-50 text-blue-700',
  'Angebot erstellt': 'bg-yellow-50 text-yellow-700',
  'Gewonnen': 'bg-green-50 text-green-700',
  'Verloren': 'bg-red-50 text-red-700',
  'Storniert': 'bg-gray-100 text-gray-500',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deals } = await supabase
    .from('deals')
    .select('id, firma_name, deal_status, bereich, kontakt_email, erstellt_am')
    .order('erstellt_am', { ascending: false })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meine Deals</h1>
        <Link
          href="/dashboard/deals/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          + Neuer Deal
        </Link>
      </div>

      <div className="mt-6">
        {deals && deals.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Firma
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bereich
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {deals.map((deal) => {
                  const statusColor =
                    STATUS_COLORS[deal.deal_status] ?? 'bg-gray-100 text-gray-700'
                  return (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/deals/${deal.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          {deal.firma_name}
                        </Link>
                        {deal.kontakt_email && (
                          <p className="text-xs text-gray-400">{deal.kontakt_email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {deal.bereich ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
                        >
                          {deal.deal_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(deal.erstellt_am).toLocaleDateString('de-DE')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-500">Noch keine Deals vorhanden.</p>
            <Link
              href="/dashboard/deals/new"
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Ersten Deal einreichen &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
