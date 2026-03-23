import { Suspense } from 'react'
import DealDetailLoading from './loading'
import DealDetailContent from './deal-detail-content'

export const dynamic = 'force-dynamic'

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense fallback={<DealDetailLoading />}>
      <DealDetailContent id={id} />
    </Suspense>
  )
}
