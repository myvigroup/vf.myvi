'use client'

import { useState } from 'react'
import { addSingleBerater } from '../actions'

export function AddBeraterForm() {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setResult(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const res = await addSingleBerater(formData)
    setPending(false)
    setResult(res)

    if (res.success) {
      form.reset()
      setTimeout(() => {
        setOpen(false)
        setResult(null)
      }, 1500)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
        style={{ background: 'var(--primary)', color: 'white' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Berater anlegen
      </button>
    )
  }

  return (
    <div
      className="bg-white p-5 mb-4"
      style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--g100)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold" style={{ color: 'var(--g800)' }}>
          Neuen Berater anlegen
        </h3>
        <button
          onClick={() => { setOpen(false); setResult(null) }}
          className="text-xs font-semibold"
          style={{ color: 'var(--g400)' }}
        >
          Abbrechen
        </button>
      </div>

      {result?.error && (
        <div className="p-2.5 text-xs font-semibold rounded-lg mb-3" style={{ background: 'var(--danger-light)', color: '#B91C1C' }}>
          {result.error}
        </div>
      )}
      {result?.success && (
        <div className="p-2.5 text-xs font-semibold rounded-lg mb-3" style={{ background: 'var(--success-light)', color: '#15803D' }}>
          Berater wurde angelegt.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-[0.68rem] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--g400)' }}>
            Name *
          </label>
          <input
            name="name"
            required
            placeholder="Max Mustermann"
            className="px-3 py-2 text-sm rounded-lg"
            style={{ border: '1.5px solid var(--g200)', width: 200 }}
          />
        </div>
        <div>
          <label className="block text-[0.68rem] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--g400)' }}>
            E-Mail *
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="m.muster@beispiel.de"
            className="px-3 py-2 text-sm rounded-lg"
            style={{ border: '1.5px solid var(--g200)', width: 240 }}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: 'var(--primary)' }}
        >
          {pending ? 'Wird angelegt...' : 'Anlegen'}
        </button>
      </form>
    </div>
  )
}
