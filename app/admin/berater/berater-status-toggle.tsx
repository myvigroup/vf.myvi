'use client'

import { useTransition } from 'react'
import { toggleUserStatus } from '../actions'

export function BeraterStatusToggle({
  userId,
  currentStatus,
}: {
  userId: string
  currentStatus: string
}) {
  const [isPending, startTransition] = useTransition()

  const newStatus = currentStatus === 'aktiv' ? 'inaktiv' : 'aktiv'
  const label = currentStatus === 'aktiv' ? 'Deaktivieren' : 'Aktivieren'

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleUserStatus(userId, newStatus)
        })
      }}
      style={{
        padding: '5px 12px',
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 6,
        border: '1px solid var(--g200)',
        background: isPending ? 'var(--g100)' : '#fff',
        color: currentStatus === 'aktiv' ? '#B91C1C' : '#15803D',
        cursor: isPending ? 'not-allowed' : 'pointer',
        opacity: isPending ? 0.6 : 1,
        transition: 'all 0.15s',
      }}
    >
      {isPending ? '...' : label}
    </button>
  )
}
