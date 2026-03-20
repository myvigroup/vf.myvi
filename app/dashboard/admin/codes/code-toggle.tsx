'use client'

import { useActionState } from 'react'
import { toggleCodeStatus, type AdminState } from '@/app/actions/admin'

const initialState: AdminState = {}

export function CodeToggle({ codeId, aktiv }: { codeId: string; aktiv: boolean }) {
  const [state, formAction, pending] = useActionState(toggleCodeStatus, initialState)

  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <input type="hidden" name="code_id" value={codeId} />
      <input type="hidden" name="aktiv" value={String(aktiv)} />
      <button
        type="submit"
        disabled={pending}
        className="px-3 py-0.5 rounded-full text-[0.72rem] font-bold transition-colors disabled:opacity-50"
        style={{
          background: aktiv ? 'var(--success-light)' : 'var(--g100)',
          color: aktiv ? '#15803D' : 'var(--g500)',
        }}
      >
        {aktiv ? 'Aktiv' : 'Inaktiv'}
      </button>
      {state.error && <span className="text-[0.68rem]" style={{ color: 'var(--danger)' }}>{state.error}</span>}
    </form>
  )
}
