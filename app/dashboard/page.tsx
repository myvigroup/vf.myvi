import { Suspense } from 'react'
import DashboardLoading from './loading'
import DashboardContent from './dashboard-content'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; view?: string }>
}) {
  const params = await searchParams

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent status={params.status} view={params.view} />
    </Suspense>
  )
}
