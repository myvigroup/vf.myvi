import { getAllDealsAdmin } from '@/lib/sharepoint'
import { DealsTable } from './deals-table'

export default async function AdminDealsPage() {
  const deals = await getAllDealsAdmin()

  return (
    <>
      <h1 className="text-xl font-bold mb-5" style={{ color: 'var(--g900)' }}>
        Alle Deals
      </h1>
      <DealsTable deals={deals} />
    </>
  )
}
