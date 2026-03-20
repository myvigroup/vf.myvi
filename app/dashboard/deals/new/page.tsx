'use client'

import { useActionState, useState } from 'react'
import { createDeal, type DealState } from '@/app/actions/deals'
import Link from 'next/link'

const INTERESSEN = [
  'mitNORM',
  'Energy & Finance',
  'mitNORM Firmenberatung',
  'Karriere-Institut',
  'WirPersonalberater',
  'Mitarbeiterempfehlung',
]

const KUNDENTYPEN = [
  { value: 'Privatkunde', label: 'Privatkunde', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { value: 'Firmenkunde', label: 'Firmenkunde', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { value: 'Mitarbeiterempfehlung', label: 'Mitarbeiterempfehlung', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
]

const initialState: DealState = {}

export default function NewDealPage() {
  const [state, formAction, pending] = useActionState(createDeal, initialState)
  const [kundentyp, setKundentyp] = useState<string>('')
  const [interesse, setInteresse] = useState<string>('')

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
            MYVI Dialog
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--g400)' }}>
            Einen Kontakt in das Netzwerk der MYVI Group einbinden.
          </p>
        </div>

        <form action={formAction} className="p-6 space-y-6">
          {state.error && (
            <div
              className="p-3 text-xs font-semibold rounded-lg"
              style={{ background: 'var(--danger-light)', color: '#B91C1C' }}
            >
              {state.error}
            </div>
          )}

          {/* Kundentyp */}
          <div>
            <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--g800)' }}>
              Mein Kunde ist ein:
            </h2>
            <div className="space-y-2">
              {KUNDENTYPEN.map((typ) => (
                <label
                  key={typ.value}
                  className="flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-all"
                  style={{
                    border: kundentyp === typ.value
                      ? '1.5px solid var(--primary)'
                      : '1.5px solid var(--g200)',
                    background: kundentyp === typ.value ? 'var(--primary-light)' : '#fff',
                  }}
                >
                  <input
                    type="radio"
                    name="kundentyp"
                    value={typ.value}
                    checked={kundentyp === typ.value}
                    onChange={(e) => setKundentyp(e.target.value)}
                    className="sr-only"
                  />
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke={kundentyp === typ.value ? 'var(--primary)' : 'var(--g400)'}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d={typ.icon} />
                  </svg>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: kundentyp === typ.value ? 'var(--primary)' : 'var(--g700)' }}
                  >
                    {typ.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Interesse an */}
          <div>
            <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--g800)' }}>
              Mein Kunde interessiert sich für:
            </h2>
            <select
              name="interesse_an"
              value={interesse}
              onChange={(e) => setInteresse(e.target.value)}
              className="block w-full px-3 py-2.5 text-sm rounded-lg"
              style={{ border: '1.5px solid var(--g200)' }}
            >
              <option value="">— Interesse an —</option>
              {INTERESSEN.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          {/* Kundeninfos — erscheint nach Auswahl */}
          {kundentyp && interesse && (
            <div className="space-y-4" style={{ borderTop: '1px solid var(--g100)', paddingTop: 24 }}>
              <h2 className="text-sm font-bold" style={{ color: 'var(--g800)' }}>
                Kundendaten:
              </h2>

              <div>
                <label htmlFor="firma_name" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
                  {kundentyp === 'Firmenkunde' ? 'Firmenname *' : 'Name *'}
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
                    E-Mail
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

              <div>
                <label htmlFor="notizen" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--g600)' }}>
                  Notizen
                </label>
                <textarea
                  id="notizen"
                  name="notizen"
                  rows={3}
                  className="block w-full px-3 py-2.5 text-sm rounded-lg resize-none"
                  style={{ border: '1.5px solid var(--g200)' }}
                />
              </div>

              {/* Hidden: Bereich wird aus Interesse + Kundentyp abgeleitet */}
              <input type="hidden" name="bereich" value={interesse} />

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--primary)' }}
                >
                  {pending ? 'Wird eingereicht...' : 'Weiter'}
                </button>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{ border: '1px solid var(--g200)', color: 'var(--g600)' }}
                >
                  Abbrechen
                </Link>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  )
}
