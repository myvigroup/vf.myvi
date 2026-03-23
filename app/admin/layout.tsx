import { requireAdmin } from '@/lib/auth-guard'
import Link from 'next/link'
import { AdminNavLinks } from './nav-links'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: '#0a0d14',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Logo + ADMIN badge */}
        <div
          style={{
            padding: '20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', letterSpacing: '0.02em' }}>Value Factory</span>
          </Link>
          <span
            style={{
              background: '#E5243B',
              color: '#fff',
              fontSize: 9,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Admin
          </span>
        </div>

        {/* Navigation */}
        <div style={{ padding: '16px 10px', flex: 1 }}>
          <AdminNavLinks />
        </div>

        {/* Back to dashboard */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: '#64748B',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Zum Dashboard
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          background: 'var(--g50)',
          padding: '32px 40px',
          minWidth: 0,
          overflowX: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  )
}
