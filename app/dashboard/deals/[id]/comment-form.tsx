'use client'

import { useActionState, useRef, useEffect } from 'react'
import { addComment, type DealState } from '@/app/actions/deals'

const initialState: DealState = {}

export function CommentForm({ dealId }: { dealId: string }) {
  const [state, formAction, pending] = useActionState(addComment, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="deal_id" value={dealId} />

      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {state.error}
        </div>
      )}

      <textarea
        name="inhalt"
        rows={3}
        required
        placeholder="Kommentar schreiben..."
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Wird gesendet...' : 'Kommentar senden'}
      </button>
    </form>
  )
}
