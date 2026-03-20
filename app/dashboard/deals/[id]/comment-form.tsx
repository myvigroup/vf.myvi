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
    <form ref={formRef} action={formAction} className="space-y-2 mt-3">
      <input type="hidden" name="deal_id" value={dealId} />

      {state.error && (
        <div
          className="p-3 text-xs font-semibold rounded-lg"
          style={{ background: 'var(--danger-light)', color: '#B91C1C' }}
        >
          {state.error}
        </div>
      )}

      <textarea
        name="inhalt"
        rows={3}
        required
        placeholder="Kommentar schreiben..."
        className="block w-full px-3 py-2.5 text-sm rounded-lg resize-none"
        style={{ border: '1.5px solid var(--g200)' }}
      />

      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'var(--primary)' }}
      >
        {pending ? 'Wird gesendet...' : 'Kommentar senden'}
      </button>
    </form>
  )
}
