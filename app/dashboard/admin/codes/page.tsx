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
    <>
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-1 text-xs font-semibold mb-4"
        style={{ color: 'var(--g400)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Admin
      </Link>

      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--g900)' }}>
        Einladungscodes
      </h1>

      {/* New Code Form */}
      <div
        className="bg-white p-5 mb-4"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      >
        <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--g400)' }}>
          Neuen Code erstellen
        </h2>
        <NewCodeForm />
      </div>

      {/* Codes Table */}
      <div
        className="bg-white overflow-hidden"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--g100)' }}>
              <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>Code</th>
              <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--g400)' }}>Label</th>
              <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>Nutzung</th>
              <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--g400)' }}>Ablauf</th>
              <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {codes?.map((c) => (
              <tr key={c.id} className={c.aktiv ? '' : 'opacity-50'} style={{ borderBottom: '1px solid var(--g50)' }}>
                <td className="px-3.5 py-3 text-sm font-mono font-bold" style={{ color: 'var(--g800)' }}>{c.code}</td>
                <td className="px-3.5 py-3 text-xs hidden sm:table-cell" style={{ color: 'var(--g500)' }}>{c.label ?? '—'}</td>
                <td className="px-3.5 py-3 text-xs" style={{ color: 'var(--g500)' }}>
                  {c.used_count} / {c.max_uses}
                </td>
                <td className="px-3.5 py-3 text-xs hidden sm:table-cell" style={{ color: 'var(--g500)' }}>
                  {c.expires_at ? new Date(c.expires_at).toLocaleDateString('de-DE') : '—'}
                </td>
                <td className="px-3.5 py-3">
                  <CodeToggle codeId={c.id} aktiv={c.aktiv} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
