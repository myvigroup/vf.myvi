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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/dashboard/admin" className="text-sm text-gray-500 hover:text-gray-700">
        &larr; Admin
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Benutzer verwalten</h1>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-Mail</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rolle</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users?.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <UserActions
                    type="rolle"
                    userId={u.id}
                    currentValue={u.rolle}
                    options={['berater', 'firmenberater', 'admin']}
                  />
                </td>
                <td className="px-4 py-3">
                  <UserActions
                    type="status"
                    userId={u.id}
                    currentValue={u.status}
                    options={['aktiv', 'inaktiv', 'gesperrt']}
                  />
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(u.created_at).toLocaleDateString('de-DE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
