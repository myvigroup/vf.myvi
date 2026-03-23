import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default async function DashboardNav({
  userSection,
}: {
  userSection?: boolean
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

  if (userSection) {
    const initials = (profile?.name ?? user.email ?? '?')
      .split(' ')
      .map((w: string) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center rounded-full text-white text-xs font-bold"
            style={{ width: 32, height: 32, background: 'var(--primary)' }}
          >
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold" style={{ color: 'var(--g800)' }}>
              {profile?.name ?? user.email}
            </div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--g400)' }}>
              {profile?.rolle ?? 'berater'}
            </div>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center justify-center rounded-md transition-colors"
            style={{
              width: 34,
              height: 34,
              border: '1px solid var(--g200)',
              color: 'var(--g400)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="hidden sm:flex items-center gap-1">
      <Link
        href="/dashboard"
        className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
        style={{ color: 'var(--g600)' }}
      >
        Deals
      </Link>
      <a
        href={`https://ud.myvi.de/?berater=${encodeURIComponent(user.email ?? '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
        style={{ color: 'var(--g600)' }}
      >
        Neuer Deal
      </a>
      {isAdmin && (
        <Link
          href="/dashboard/admin"
          className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
          style={{ color: 'var(--g600)' }}
        >
          Admin
        </Link>
      )}
    </div>
  )
}
