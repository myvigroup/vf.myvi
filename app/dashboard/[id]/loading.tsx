export default function DealDetailLoading() {
  return (
    <>
      {/* Loading indicator */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="animate-spin rounded-full"
          style={{
            width: 18,
            height: 18,
            border: '2.5px solid var(--g200)',
            borderTopColor: 'var(--primary)',
          }}
        />
        <span className="text-xs font-semibold" style={{ color: 'var(--g400)' }}>
          Deal wird geladen...
        </span>
      </div>

      {/* Back link skeleton */}
      <div className="animate-pulse rounded mb-4" style={{ width: 140, height: 14, background: 'var(--g100)' }} />

      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-5">
        <div className="animate-pulse rounded" style={{ width: 260, height: 28, background: 'var(--g100)' }} />
        <div className="animate-pulse rounded-xl" style={{ width: 80, height: 22, background: 'var(--g100)' }} />
      </div>

      {/* Detail card skeleton */}
      <div
        className="bg-white mb-4"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="px-5 py-4" style={{ borderBottom: '1px solid var(--g50)' }}>
              <div className="animate-pulse rounded mb-2" style={{ width: 90, height: 10, background: 'var(--g100)' }} />
              <div className="animate-pulse rounded" style={{ width: 160 + (i % 3) * 40, height: 16, background: 'var(--g100)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Comments skeleton */}
      <div
        className="bg-white"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--g100)' }}>
          <div className="animate-pulse rounded" style={{ width: 120, height: 10, background: 'var(--g100)' }} />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-5 py-3.5 flex gap-3" style={{ borderBottom: '1px solid var(--g50)' }}>
            <div className="animate-pulse rounded-full shrink-0" style={{ width: 32, height: 32, background: 'var(--g100)' }} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-pulse rounded" style={{ width: 100, height: 12, background: 'var(--g100)' }} />
                <div className="animate-pulse rounded" style={{ width: 80, height: 10, background: 'var(--g100)' }} />
              </div>
              <div className="animate-pulse rounded" style={{ width: '80%', height: 14, background: 'var(--g100)' }} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
