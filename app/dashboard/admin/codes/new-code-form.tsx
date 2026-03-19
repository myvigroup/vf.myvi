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
    <form ref={formRef} action={formAction} className="mt-4 space-y-4">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
          Code erfolgreich erstellt.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium">Code *</label>
          <input
            id="code"
            name="code"
            type="text"
            required
            placeholder="z.B. VF-2026"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="label" className="block text-sm font-medium">Label</label>
          <input
            id="label"
            name="label"
            type="text"
            placeholder="z.B. Kampagne März"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="max_uses" className="block text-sm font-medium">Max. Nutzungen</label>
          <input
            id="max_uses"
            name="max_uses"
            type="number"
            min={1}
            defaultValue={10}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="expires_at" className="block text-sm font-medium">Ablaufdatum</label>
          <input
            id="expires_at"
            name="expires_at"
            type="date"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
      >
        {pending ? 'Wird erstellt...' : 'Code erstellen'}
      </button>
    </form>
  )
}
