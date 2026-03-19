'use client'

import { useActionState } from 'react'
import { updateUserRole, updateUserStatus, type AdminState } from '@/app/actions/admin'

const initialState: AdminState = {}

export function UserActions({
  type,
  userId,
  currentValue,
  options,
}: {
  type: 'rolle' | 'status'
  userId: string
  currentValue: string
  options: string[]
}) {
  const action = type === 'rolle' ? updateUserRole : updateUserStatus
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="flex items-center gap-1">
      <input type="hidden" name="user_id" value={userId} />
      <select
        name={type}
        defaultValue={currentValue}
        disabled={pending}
        onChange={(e) => {
          const form = e.target.closest('form')
          if (form) form.requestSubmit()
        }}
        className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none disabled:opacity-50"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {state.error && (
        <span className="text-xs text-red-600">{state.error}</span>
      )}
    </form>
  )
}
