export default function DealDetailLoading() {
  return (
    <>
      {/* Back link skeleton */}
      <div className="animate-pulse bg-g100 h-4 w-36 rounded mb-4" style={{ background: 'var(--g100)' }} />

      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-5">
        <div className="animate-pulse h-7 w-64 rounded" style={{ background: 'var(--g100)' }} />
        <div className="animate-pulse h-6 w-20 rounded-xl" style={{ background: 'var(--g100)' }} />
      </div>

      {/* Detail card skeleton */}
      <div
        className="bg-white mb-4"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="px-5 py-4" style={{ borderBottom: '1px solid var(--g50)' }}>
              <div className="animate-pulse h-3 w-24 rounded mb-2" style={{ background: 'var(--g100)' }} />
              <div className="animate-pulse h-4 w-48 rounded" style={{ background: 'var(--g100)' }} />
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
          <div className="animate-pulse h-3 w-28 rounded" style={{ background: 'var(--g100)' }} />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-5 py-3.5 flex gap-3" style={{ borderBottom: '1px solid var(--g50)' }}>
            <div className="animate-pulse rounded-full shrink-0" style={{ width: 32, height: 32, background: 'var(--g100)' }} />
            <div className="flex-1">
              <div className="animate-pulse h-3 w-32 rounded mb-2" style={{ background: 'var(--g100)' }} />
              <div className="animate-pulse h-4 w-full rounded" style={{ background: 'var(--g100)' }} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
