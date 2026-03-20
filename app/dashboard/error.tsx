'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      className="bg-white p-8 text-center"
      style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
    >
      <div
        className="mx-auto mb-3 flex items-center justify-center rounded-full"
        style={{ width: 40, height: 40, background: 'var(--danger-light)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h2 className="text-sm font-bold" style={{ color: 'var(--g800)' }}>
        Etwas ist schiefgelaufen
      </h2>
      <p className="mt-1 text-xs" style={{ color: 'var(--g400)' }}>
        {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
      </p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white"
        style={{ background: 'var(--primary)' }}
      >
        Erneut versuchen
      </button>
    </div>
  )
}
