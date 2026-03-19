import { requireAdmin } from '@/lib/auth-guard'
import Link from 'next/link'

export default async function AdminPage() {
  await requireAdmin()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
        &larr; Zurück zum Dashboard
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Administration</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/dashboard/admin/users"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-sm"
        >
          <h2 className="text-lg font-semibold">Benutzer</h2>
          <p className="mt-1 text-sm text-gray-500">
            Rollen und Status von Beratern verwalten
          </p>
        </Link>

        <Link
          href="/dashboard/admin/codes"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-sm"
        >
          <h2 className="text-lg font-semibold">Einladungscodes</h2>
          <p className="mt-1 text-sm text-gray-500">
            Codes erstellen und verwalten
          </p>
        </Link>
      </div>
    </div>
  )
}
