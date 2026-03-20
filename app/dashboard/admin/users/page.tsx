import { requireAdmin } from '@/lib/auth-guard'
import Link from 'next/link'
import { UserActions } from './user-actions'

export default async function AdminUsersPage() {
  const { supabase } = await requireAdmin()

  const { data: users } = await supabase
    .from('users')
    .select('id, email, name, rolle, status, vermittler_nr, created_at')
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
        Benutzer verwalten
      </h1>

      <div
        className="bg-white overflow-hidden"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--g100)' }}>
              <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>Name</th>
              <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--g400)' }}>E-Mail</th>
              <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>Rolle</th>
              <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>Status</th>
              <th className="px-3.5 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--g400)' }}>Datum</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--g50)' }}>
                <td className="px-3.5 py-3 text-sm font-semibold" style={{ color: 'var(--g800)' }}>{u.name}</td>
                <td className="px-3.5 py-3 text-xs hidden sm:table-cell" style={{ color: 'var(--g500)' }}>{u.email}</td>
                <td className="px-3.5 py-3">
                  <UserActions
                    type="rolle"
                    userId={u.id}
                    currentValue={u.rolle}
                    options={['berater', 'firmenberater', 'admin']}
                  />
                </td>
                <td className="px-3.5 py-3">
                  <UserActions
                    type="status"
                    userId={u.id}
                    currentValue={u.status}
                    options={['aktiv', 'inaktiv', 'gesperrt']}
                  />
                </td>
                <td className="px-3.5 py-3 text-xs hidden md:table-cell" style={{ color: 'var(--g400)' }}>
                  {new Date(u.created_at).toLocaleDateString('de-DE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
