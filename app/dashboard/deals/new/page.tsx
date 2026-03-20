'use client'

import { useActionState } from 'react'
import { createDeal, type DealState } from '@/app/actions/deals'
import Link from 'next/link'

const BEREICHE = [
  'Energie',
  'Versicherung',
  'Finanzierung',
  'Telekommunikation',
  'Sonstiges',
]

const initialState: DealState = {}

export default function NewDealPage() {
  const [state, formAction, pending] = useActionState(createDeal, initialState)

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-xs font-semibold mb-4"
        style={{ color: 'var(--g400)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Zurück
      </Link>

      <div
        className="bg-white max-w-2xl"
        style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--g100)' }}>
          <h1 className="text-lg font-bold" style={{ color: 'var(--g900)' }}>
            Neuen Deal einreichen
          </h1>
        </div>

        <form action={formAction} className="p-6 space-y-4">
          {state.error && (
            <div
              className="p-3 text-xs font-semibold rounded-lg"
              style={{ background: 'var(--danger-light)', color: '#B91C1C' }}
            >
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="firma_name" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
              Firmenname *
            </label>
            <input
              id="firma_name"
              name="firma_name"
              type="text"
              required
              className="block w-full px-3 py-2.5 text-sm rounded-lg"
              style={{ border: '1.5px solid var(--g200)' }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="kontakt_email" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
                Kontakt E-Mail
              </label>
              <input
                id="kontakt_email"
                name="kontakt_email"
                type="email"
                className="block w-full px-3 py-2.5 text-sm rounded-lg"
                style={{ border: '1.5px solid var(--g200)' }}
              />
            </div>

            <div>
              <label htmlFor="telefonnummer" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
                Telefonnummer
              </label>
              <input
                id="telefonnummer"
                name="telefonnummer"
                type="tel"
                className="block w-full px-3 py-2.5 text-sm rounded-lg"
                style={{ border: '1.5px solid var(--g200)' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="telefonnummer_2" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
              Telefonnummer 2
            </label>
            <input
              id="telefonnummer_2"
              name="telefonnummer_2"
              type="tel"
              className="block w-full px-3 py-2.5 text-sm rounded-lg"
              style={{ border: '1.5px solid var(--g200)' }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="bereich" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
                Bereich
              </label>
              <select
                id="bereich"
                name="bereich"
                className="block w-full px-3 py-2.5 text-sm rounded-lg"
                style={{ border: '1.5px solid var(--g200)' }}
              >
                <option value="">— Bitte wählen —</option>
                {BEREICHE.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="interesse_an" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
                Interesse an
              </label>
              <input
                id="interesse_an"
                name="interesse_an"
                type="text"
                className="block w-full px-3 py-2.5 text-sm rounded-lg"
                style={{ border: '1.5px solid var(--g200)' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="notizen" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
              Notizen
            </label>
            <textarea
              id="notizen"
              name="notizen"
              rows={4}
              className="block w-full px-3 py-2.5 text-sm rounded-lg resize-none"
              style={{ border: '1.5px solid var(--g200)' }}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--primary)' }}
            >
              {pending ? 'Wird eingereicht...' : 'Deal einreichen'}
            </button>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{ border: '1px solid var(--g200)', color: 'var(--g600)' }}
            >
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
