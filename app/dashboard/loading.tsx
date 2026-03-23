export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div
        className="animate-spin rounded-full mb-4"
        style={{
          width: 40,
          height: 40,
          border: '3px solid var(--g200)',
          borderTopColor: 'var(--primary)',
        }}
      />
      <div className="text-sm font-semibold" style={{ color: 'var(--g500)' }}>
        Deals werden geladen...
      </div>
    </div>
  )
}
