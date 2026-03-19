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
        className={`rounded-full px-3 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${
          aktiv
            ? 'bg-green-50 text-green-700 hover:bg-green-100'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        {aktiv ? 'Aktiv' : 'Inaktiv'}
      </button>
      {state.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  )
}
