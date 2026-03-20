import { requireAdmin } from '@/lib/auth-guard'
import Link from 'next/link'

export default async function AdminPage() {
  await requireAdmin()

  return (
    <>
      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--g900)' }}>
        Administration
      </h1>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-2xl">
        <Link
          href="/dashboard/admin/users"
          className="bg-white p-5 transition-all hover:shadow-sm"
          style={{ borderRadius: 'var(--r-md)', border: '1.5px solid var(--g100)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-lg shrink-0"
              style={{ width: 40, height: 40, background: 'var(--primary-light)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--g800)' }}>Benutzer</div>
              <div className="text-xs" style={{ color: 'var(--g400)' }}>Rollen und Status verwalten</div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/admin/codes"
          className="bg-white p-5 transition-all hover:shadow-sm"
          style={{ borderRadius: 'var(--r-md)', border: '1.5px solid var(--g100)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-lg shrink-0"
              style={{ width: 40, height: 40, background: 'var(--accent-light)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--g800)' }}>Einladungscodes</div>
              <div className="text-xs" style={{ color: 'var(--g400)' }}>Codes erstellen und verwalten</div>
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}
