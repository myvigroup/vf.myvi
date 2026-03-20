'use client'

import { useActionState, useRef, useEffect } from 'react'
import { createInvitationCode, type AdminState } from '@/app/actions/admin'

const initialState: AdminState = {}

export function NewCodeForm() {
  const [state, formAction, pending] = useActionState(createInvitationCode, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) formRef.current?.reset()
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state.error && (
        <div className="p-3 text-xs font-semibold rounded-lg" style={{ background: 'var(--danger-light)', color: '#B91C1C' }}>
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="p-3 text-xs font-semibold rounded-lg" style={{ background: 'var(--success-light)', color: '#15803D' }}>
          Code erfolgreich erstellt.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div>
          <label htmlFor="code" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>Code *</label>
          <input
            id="code" name="code" type="text" required placeholder="z.B. VF-2026"
            className="block w-full px-3 py-2 text-sm rounded-lg uppercase"
            style={{ border: '1.5px solid var(--g200)' }}
          />
        </div>
        <div>
          <label htmlFor="label" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>Label</label>
          <input
            id="label" name="label" type="text" placeholder="Kampagne März"
            className="block w-full px-3 py-2 text-sm rounded-lg"
            style={{ border: '1.5px solid var(--g200)' }}
          />
        </div>
        <div>
          <label htmlFor="max_uses" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>Max. Nutzungen</label>
          <input
            id="max_uses" name="max_uses" type="number" min={1} defaultValue={10}
            className="block w-full px-3 py-2 text-sm rounded-lg"
            style={{ border: '1.5px solid var(--g200)' }}
          />
        </div>
        <div>
          <label htmlFor="expires_at" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>Ablaufdatum</label>
          <input
            id="expires_at" name="expires_at" type="date"
            className="block w-full px-3 py-2 text-sm rounded-lg"
            style={{ border: '1.5px solid var(--g200)' }}
          />
        </div>
      </div>

      <button
        type="submit" disabled={pending}
        className="px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
        style={{ background: 'var(--primary)' }}
      >
        {pending ? 'Wird erstellt...' : 'Code erstellen'}
      </button>
    </form>
  )
}
