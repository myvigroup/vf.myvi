import { requireAdmin } from '@/lib/auth-guard'
import Link from 'next/link'
import { NewCodeForm } from './new-code-form'
import { CodeToggle } from './code-toggle'

export default async function AdminCodesPage() {
  const { supabase } = await requireAdmin()

  const { data: codes } = await supabase
    .from('invitation_codes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/dashboard/admin" className="text-sm text-gray-500 hover:text-gray-700">
        &larr; Admin
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Einladungscodes</h1>

      {/* Neuen Code erstellen */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase text-gray-500">Neuen Code erstellen</h2>
        <NewCodeForm />
      </div>

      {/* Code-Liste */}
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nutzung</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ablauf</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {codes?.map((c) => (
              <tr key={c.id} className={c.aktiv ? '' : 'opacity-50'}>
                <td className="px-4 py-3 text-sm font-mono font-medium">{c.code}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{c.label ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {c.used_count} / {c.max_uses}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {c.expires_at
                    ? new Date(c.expires_at).toLocaleDateString('de-DE')
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <CodeToggle codeId={c.id} aktiv={c.aktiv} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
