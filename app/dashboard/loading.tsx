export default function DashboardLoading() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white h-20"
            style={{ borderRadius: 'var(--r-md)', border: '1.5px solid var(--g100)' }}
          />
        ))}
      </div>
      <div
        className="animate-pulse bg-white h-64"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      />
    </>
  )
}
