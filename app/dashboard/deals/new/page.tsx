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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Zurück zum Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Neuen Deal einreichen</h1>
      </div>

      <form action={formAction} className="space-y-5">
        {state.error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="firma_name" className="block text-sm font-medium">
            Firmenname *
          </label>
          <input
            id="firma_name"
            name="firma_name"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="kontakt_email" className="block text-sm font-medium">
              Kontakt E-Mail
            </label>
            <input
              id="kontakt_email"
              name="kontakt_email"
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="telefonnummer" className="block text-sm font-medium">
              Telefonnummer
            </label>
            <input
              id="telefonnummer"
              name="telefonnummer"
              type="tel"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="telefonnummer_2" className="block text-sm font-medium">
            Telefonnummer 2
          </label>
          <input
            id="telefonnummer_2"
            name="telefonnummer_2"
            type="tel"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="bereich" className="block text-sm font-medium">
              Bereich
            </label>
            <select
              id="bereich"
              name="bereich"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">— Bitte wählen —</option>
              {BEREICHE.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="interesse_an" className="block text-sm font-medium">
              Interesse an
            </label>
            <input
              id="interesse_an"
              name="interesse_an"
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notizen" className="block text-sm font-medium">
            Notizen
          </label>
          <textarea
            id="notizen"
            name="notizen"
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? 'Wird eingereicht...' : 'Deal einreichen'}
          </button>
          <Link
            href="/dashboard"
            className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  )
}
