export default function DashboardLoading() {
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
          Deals werden geladen...
        </span>
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white"
            style={{
              height: 80,
              borderRadius: 'var(--r-md)',
              border: '1.5px solid var(--g100)',
            }}
          />
        ))}
      </div>

      {/* Filter Skeleton */}
      <div className="flex items-center gap-1.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg"
            style={{
              width: i === 0 ? 40 : 80 + i * 10,
              height: 30,
              background: 'var(--g100)',
            }}
          />
        ))}
      </div>

      {/* Table Skeleton */}
      <div
        className="bg-white overflow-hidden"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      >
        {/* Header */}
        <div className="flex gap-4 px-3.5 py-3" style={{ borderBottom: '1px solid var(--g100)' }}>
          {[120, 70, 100, 90, 60].map((w, i) => (
            <div
              key={i}
              className="animate-pulse rounded"
              style={{ width: w, height: 12, background: 'var(--g100)' }}
            />
          ))}
        </div>
        {/* Rows */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-3.5 py-3.5"
            style={{ borderBottom: '1px solid var(--g50)' }}
          >
            <div className="animate-pulse rounded" style={{ width: 140, height: 14, background: 'var(--g100)' }} />
            <div className="animate-pulse rounded-xl" style={{ width: 80, height: 20, background: 'var(--g100)' }} />
            <div className="animate-pulse rounded hidden md:block" style={{ width: 120, height: 12, background: 'var(--g100)' }} />
            <div className="animate-pulse rounded hidden sm:block" style={{ width: 100, height: 12, background: 'var(--g100)' }} />
            <div className="animate-pulse rounded hidden sm:block" style={{ width: 70, height: 12, background: 'var(--g100)' }} />
          </div>
        ))}
      </div>
    </>
  )
}
