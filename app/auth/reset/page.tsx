'use client'

import { useActionState } from 'react'
import { updatePassword, type AuthState } from '@/app/actions/auth'

const initialState: AuthState = {}

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState)

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{ background: '#111520' }}
    >
      <div className="w-full" style={{ maxWidth: 380 }}>
        <div className="mb-8 text-center">
          <img src="/logo.png" alt="Value Factory" className="mx-auto" style={{ height: 32 }} />
        </div>

        <h2 className="mb-1" style={{ fontSize: 24, fontWeight: 600, color: 'white' }}>
          Neues Passwort setzen
        </h2>
        <p className="mb-6" style={{ fontSize: 13, color: '#94a3b8' }}>
          Wählen Sie ein neues Passwort (mindestens 8 Zeichen)
        </p>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <div
              className="p-3 text-xs font-semibold rounded-lg"
              style={{ background: 'rgba(229,36,59,0.1)', color: '#f87171' }}
            >
              {state.error}
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block mb-1.5"
              style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}
            >
              Neues Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="block w-full text-sm"
              style={{
                background: '#161c2d',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                padding: '12px 16px',
                color: 'white',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password_confirm"
              className="block mb-1.5"
              style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}
            >
              Passwort bestätigen
            </label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              required
              autoComplete="new-password"
              className="block w-full text-sm"
              style={{
                background: '#161c2d',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                padding: '12px 16px',
                color: 'white',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full text-white transition-colors disabled:opacity-50"
            style={{ background: '#30bcdf', borderRadius: 8, padding: 12, fontWeight: 600, fontSize: 15 }}
          >
            {pending ? 'Wird gespeichert...' : 'Passwort ändern'}
          </button>
        </form>
      </div>
    </div>
  )
}
