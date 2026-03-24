'use client'

import { useActionState } from 'react'
import { login, type AuthState } from '@/app/actions/auth'
import Link from 'next/link'

const initialState: AuthState = {}

export function LoginForm({
  logo,
  name,
  primary,
  loginBg,
  headline,
  subtext,
  features,
  label,
}: {
  logo: string
  name: string
  primary: string
  loginBg: string
  headline: string
  subtext: string
  features: string[]
  label: string
}) {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <div className="flex min-h-screen">
      {/* Left — Branding (hidden on mobile) */}
      <div
        className="hidden md:flex md:w-[60%] flex-col justify-between p-10"
        style={{
          background: '#ffffff',
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      >
        <div>
          <img src={logo} alt={name} style={{ height: 32 }} />
        </div>

        <div style={{ maxWidth: 480 }}>
          <h1
            className="leading-tight"
            style={{ fontSize: 36, fontWeight: 600, color: '#0a0d14', whiteSpace: 'pre-line' }}
          >
            {headline}
          </h1>
          <p className="mt-4" style={{ fontSize: 16, color: '#64748b' }}>
            {subtext}
          </p>
        </div>

        <div className="space-y-2.5">
          {features.map((text) => (
            <div key={text} className="flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontSize: 14, color: '#64748b' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Login Form */}
      <div
        className="w-full md:w-[40%] flex items-center justify-center px-6 py-12"
        style={{
          background: loginBg,
          borderLeft: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="w-full" style={{ maxWidth: 380, padding: '0 8px' }}>
          <div className="md:hidden mb-8 text-center">
            <img src={logo} alt={name} className="mx-auto" style={{ height: 32 }} />
          </div>

          <div
            className="mb-1"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: 3,
              color: primary,
              textTransform: 'uppercase',
            }}
          >
            {label}
          </div>
          <h2 className="mb-1" style={{ fontSize: 24, fontWeight: 600, color: 'white' }}>
            Willkommen zurück
          </h2>
          <p className="mb-6" style={{ fontSize: 13, color: '#94a3b8' }}>
            Mit deinem Account anmelden
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
              <label htmlFor="email" className="block mb-1.5" style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                E-Mail
              </label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                placeholder="name@beispiel.de"
                className="block w-full text-sm login-input"
                style={{ background: '#161c2d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px 16px', color: 'white' }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                  Passwort
                </label>
                <Link href="/passwort-vergessen" style={{ fontSize: 11, color: primary, fontWeight: 600 }}>
                  Vergessen?
                </Link>
              </div>
              <input
                id="password" name="password" type="password" required autoComplete="current-password"
                className="block w-full text-sm login-input"
                style={{ background: '#161c2d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px 16px', color: 'white' }}
              />
            </div>

            <button
              type="submit" disabled={pending}
              className="w-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: primary, borderRadius: 8, padding: 12, fontWeight: 600, fontSize: 15 }}
            >
              {pending ? 'Wird angemeldet...' : 'Anmelden'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 12, color: '#64748b' }}>oder</span>
            <div className="flex-1" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <Link
            href="/register"
            className="block w-full text-center transition-colors login-btn-secondary"
            style={{ borderRadius: 8, padding: 12, fontWeight: 600, fontSize: 15 }}
          >
            Registrieren
          </Link>

          <p className="text-center mt-6" style={{ fontSize: 12, color: '#64748b' }}>
            Noch kein Account? Einladungscode erhalten?
          </p>
        </div>
      </div>
    </div>
  )
}
