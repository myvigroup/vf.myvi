'use client'

import { useTransition, useRef } from 'react'
import { createInvitationCode } from '../actions'

export function NewCodeForm() {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    const code = formData.get('code') as string
    const label = formData.get('label') as string
    const maxUses = parseInt(formData.get('maxUses') as string, 10) || 10
    const expiresAt = (formData.get('expiresAt') as string) || null

    if (!code.trim()) return

    startTransition(async () => {
      await createInvitationCode(code.trim(), label.trim(), maxUses, expiresAt)
      formRef.current?.reset()
    })
  }

  const inputStyle = {
    padding: '8px 12px',
    fontSize: 13,
    border: '1.5px solid var(--g200)',
    borderRadius: 'var(--r-sm)',
    background: '#fff',
    color: 'var(--g800)',
    width: '100%',
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap gap-3 items-end">
      <div style={{ flex: '1 1 160px' }}>
        <label
          className="block text-xs font-semibold mb-1"
          style={{ color: 'var(--g500)' }}
        >
          Code *
        </label>
        <input
          name="code"
          required
          placeholder="z.B. BERATER2026"
          style={inputStyle}
        />
      </div>
      <div style={{ flex: '1 1 160px' }}>
        <label
          className="block text-xs font-semibold mb-1"
          style={{ color: 'var(--g500)' }}
        >
          Label
        </label>
        <input
          name="label"
          placeholder="Beschreibung (optional)"
          style={inputStyle}
        />
      </div>
      <div style={{ flex: '0 0 100px' }}>
        <label
          className="block text-xs font-semibold mb-1"
          style={{ color: 'var(--g500)' }}
        >
          Max. Nutzungen
        </label>
        <input
          name="maxUses"
          type="number"
          defaultValue={10}
          min={1}
          style={inputStyle}
        />
      </div>
      <div style={{ flex: '0 0 160px' }}>
        <label
          className="block text-xs font-semibold mb-1"
          style={{ color: 'var(--g500)' }}
        >
          Ablaufdatum
        </label>
        <input name="expiresAt" type="date" style={inputStyle} />
      </div>
      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: '8px 20px',
          fontSize: 13,
          fontWeight: 600,
          borderRadius: 'var(--r-sm)',
          border: 'none',
          background: '#f0a847',
          color: '#fff',
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.6 : 1,
          transition: 'all 0.15s',
        }}
      >
        {isPending ? 'Erstelle...' : 'Erstellen'}
      </button>
    </form>
  )
}
