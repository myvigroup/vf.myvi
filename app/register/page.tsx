'use client'

import { useActionState } from 'react'
import { register, type AuthState } from '@/app/actions/auth'
import Link from 'next/link'

const initialState: AuthState = {}

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, initialState)

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div
            className="mx-auto flex items-center justify-center rounded-2xl text-white font-bold text-lg mb-4"
            style={{ width: 44, height: 44, background: 'var(--primary)' }}
          >
            VF
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--g900)' }}>
            Konto erstellen
          </h1>
          <p className="mt-1 text-xs" style={{ color: 'var(--g400)' }}>
            Erstellen Sie Ihr Berater-Konto
          </p>
        </div>

        <div
          className="bg-white p-6"
          style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--g100)', boxShadow: 'var(--shadow-sm)' }}
        >
          <form action={formAction} className="space-y-4">
            {state.error && (
              <div
                className="p-3 text-xs font-semibold rounded-lg"
                style={{ background: 'var(--danger-light)', color: '#B91C1C' }}
              >
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="block w-full px-3 py-2.5 text-sm rounded-lg"
                style={{ border: '1.5px solid var(--g200)' }}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
                E-Mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full px-3 py-2.5 text-sm rounded-lg"
                style={{ border: '1.5px solid var(--g200)' }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="block w-full px-3 py-2.5 text-sm rounded-lg"
                style={{ border: '1.5px solid var(--g200)' }}
              />
              <p className="mt-1 text-[0.68rem]" style={{ color: 'var(--g400)' }}>
                Mindestens 8 Zeichen
              </p>
            </div>

            <div>
              <label htmlFor="invitation_code" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
                Einladungscode
              </label>
              <input
                id="invitation_code"
                name="invitation_code"
                type="text"
                required
                className="block w-full px-3 py-2.5 text-sm rounded-lg uppercase"
                style={{ border: '1.5px solid var(--g200)' }}
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--primary)' }}
            >
              {pending ? 'Wird registriert...' : 'Konto erstellen'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs" style={{ color: 'var(--g400)' }}>
          Bereits registriert?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--primary)' }}>
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}
