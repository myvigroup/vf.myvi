'use client'

import { useActionState } from 'react'
import { resetPassword, type AuthState } from '@/app/actions/auth'
import Link from 'next/link'

const initialState: AuthState = {}

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, initialState)

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
          Passwort zurücksetzen
        </h2>
        <p className="mb-6" style={{ fontSize: 13, color: '#94a3b8' }}>
          Wir senden Ihnen einen Link zum Zurücksetzen
        </p>

        {state.success ? (
          <div
            className="p-4 rounded-lg mb-4"
            style={{ background: 'rgba(0,182,122,0.1)', color: '#34d399' }}
          >
            <div className="text-sm font-semibold mb-1">E-Mail gesendet</div>
            <div className="text-xs" style={{ color: '#94a3b8' }}>
              Falls ein Account mit dieser E-Mail existiert, erhalten Sie einen Link zum Zurücksetzen.
            </div>
          </div>
        ) : (
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
                htmlFor="email"
                className="block mb-1.5"
                style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}
              >
                E-Mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@beispiel.de"
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
              {pending ? 'Wird gesendet...' : 'Link senden'}
            </button>
          </form>
        )}

        <p className="text-center mt-6">
          <Link href="/login" style={{ fontSize: 13, color: '#30bcdf', fontWeight: 600 }}>
            Zurück zum Login
          </Link>
        </p>
      </div>
    </div>
  )
}
