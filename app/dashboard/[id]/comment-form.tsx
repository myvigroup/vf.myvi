'use client'

import { useActionState, useRef, useEffect } from 'react'
import { submitComment, type CommentState } from '@/app/actions/comments'

const initialState: CommentState = {}

export default function CommentForm({ dealId }: { dealId: string }) {
  const [state, formAction, pending] = useActionState(submitComment, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <div className="px-5 py-4" style={{ borderTop: '1px solid var(--g100)' }}>
      <div
        className="text-[0.72rem] font-bold uppercase tracking-wider mb-2"
        style={{ color: 'var(--g400)' }}
      >
        Kommentar hinterlassen
      </div>

      <form ref={formRef} action={formAction} className="space-y-2">
        <input type="hidden" name="dealId" value={dealId} />

        {state.error && (
          <div
            className="p-2.5 text-xs font-semibold rounded-lg"
            style={{ background: 'var(--danger-light)', color: '#B91C1C' }}
          >
            {state.error}
          </div>
        )}

        {state.success && (
          <div
            className="p-2.5 text-xs font-semibold rounded-lg"
            style={{ background: 'var(--success-light)', color: '#15803D' }}
          >
            Kommentar gespeichert.
          </div>
        )}

        <textarea
          name="comment"
          required
          rows={3}
          placeholder="Ihr Kommentar zum Deal..."
          className="block w-full px-3 py-2.5 text-sm rounded-lg resize-none"
          style={{ border: '1.5px solid var(--g200)' }}
        />

        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: 'var(--primary)' }}
        >
          {pending ? 'Wird gesendet...' : 'Kommentar senden'}
        </button>
      </form>
    </div>
  )
}
