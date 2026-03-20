import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <div className="text-center space-y-3">
        <div className="text-5xl font-bold" style={{ color: 'var(--g200)' }}>404</div>
        <p className="text-sm" style={{ color: 'var(--g400)' }}>Seite nicht gefunden.</p>
        <Link
          href="/dashboard"
          className="inline-block text-sm font-semibold"
          style={{ color: 'var(--primary)' }}
        >
          Zum Dashboard &rarr;
        </Link>
      </div>
    </div>
  )
}
