'use client'

import { useTransition } from 'react'
import { deactivateCode } from '../actions'

export function CodeDeactivateButton({ codeId }: { codeId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deactivateCode(codeId)
        })
      }}
      style={{
        padding: '5px 12px',
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 6,
        border: '1px solid var(--g200)',
        background: isPending ? 'var(--g100)' : '#fff',
        color: '#B91C1C',
        cursor: isPending ? 'not-allowed' : 'pointer',
        opacity: isPending ? 0.6 : 1,
        transition: 'all 0.15s',
      }}
    >
      {isPending ? '...' : 'Deaktivieren'}
    </button>
  )
}
