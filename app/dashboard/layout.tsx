import { Suspense } from 'react'
import Link from 'next/link'
import DashboardNav from './nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-full">
      {/* Header — static shell renders immediately */}
      <nav
        className="sticky top-0 z-50 bg-white"
        style={{ borderBottom: '1px solid var(--g200)', height: 56 }}
      >
        <div className="mx-auto max-w-[1400px] h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="flex items-center">
              <img src="/logo.png" alt="Value Factory" style={{ height: 28 }} />
            </Link>
            <div
              className="hidden sm:block"
              style={{ width: 1, height: 24, background: 'var(--g200)' }}
            />
            <Suspense fallback={<NavSkeleton />}>
              <DashboardNav />
            </Suspense>
          </div>

          <Suspense fallback={<UserSkeleton />}>
            <DashboardNav userSection />
          </Suspense>
        </div>
      </nav>

      {/* Content — renders immediately, children use their own Suspense */}
      <main className="mx-auto max-w-[1400px] px-6 py-5">
        {children}
      </main>
    </div>
  )
}

function NavSkeleton() {
  return (
    <div className="hidden sm:flex items-center gap-1">
      <div className="animate-pulse h-4 w-12 rounded" style={{ background: 'var(--g100)' }} />
      <div className="animate-pulse h-4 w-16 rounded" style={{ background: 'var(--g100)' }} />
    </div>
  )
}

function UserSkeleton() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="animate-pulse rounded-full" style={{ width: 32, height: 32, background: 'var(--g100)' }} />
      <div className="hidden sm:block space-y-1">
        <div className="animate-pulse h-3 w-24 rounded" style={{ background: 'var(--g100)' }} />
        <div className="animate-pulse h-2 w-14 rounded" style={{ background: 'var(--g100)' }} />
      </div>
    </div>
  )
}
