import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('name, rolle')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.rolle === 'admin'

  return (
    <div className="min-h-full">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-lg font-bold">
                MYVI Dialog
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Deals
                </Link>
                <Link
                  href="/dashboard/deals/new"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Neuer Deal
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard/admin"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {profile?.name ?? user.email}
                {profile?.rolle && (
                  <span className="ml-1.5 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20 ring-inset">
                    {profile.rolle}
                  </span>
                )}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>{children}</main>
    </div>
  )
}
