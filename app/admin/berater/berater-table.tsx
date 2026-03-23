'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { BeraterStatusToggle } from './berater-status-toggle'
import { bulkInvite, bulkDeactivate } from '../actions'

interface User {
  id: string
  email: string
  name: string
  rolle: string
  status: string
  created_at: string
}

interface BeraterTableProps {
  users: User[]
  dealCounts: Record<string, number>
}

function statusBadge(status: string) {
  switch (status) {
    case 'aktiv':
      return { bg: 'var(--success-light)', color: '#15803D' }
    case 'eingeladen':
      return { bg: '#EFF6FF', color: '#1D4ED8' }
    case 'inaktiv':
      return { bg: 'var(--g100)', color: 'var(--g500)' }
    case 'gesperrt':
      return { bg: 'var(--danger-light)', color: '#B91C1C' }
    default:
      return { bg: 'var(--g100)', color: 'var(--g500)' }
  }
}

function rolleBadge(rolle: string) {
  switch (rolle) {
    case 'admin':
      return { bg: 'rgba(240,168,71,0.1)', color: '#f0a847' }
    case 'firmenberater':
      return { bg: 'var(--accent-light)', color: '#0E7490' }
    default:
      return { bg: '#EEF2FF', color: '#4338CA' }
  }
}

export function BeraterTable({ users, dealCounts }: BeraterTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [actionResult, setActionResult] = useState<string | null>(null)

  const allSelected = users.length > 0 && selected.size === users.length
  const someSelected = selected.size > 0

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(users.map((u) => u.id)))
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleBulkInvite() {
    const ids = Array.from(selected)
    startTransition(async () => {
      const res = await bulkInvite(ids)
      setActionResult(`${res.sent} Einladungen versendet`)
      setSelected(new Set())
      setTimeout(() => setActionResult(null), 3000)
    })
  }

  function handleBulkDeactivate() {
    const ids = Array.from(selected)
    startTransition(async () => {
      const res = await bulkDeactivate(ids)
      setActionResult(`${res.deactivated} Berater deaktiviert`)
      setSelected(new Set())
      setTimeout(() => setActionResult(null), 3000)
    })
  }

  return (
    <>
      {actionResult && (
        <div
          style={{
            marginBottom: 12,
            padding: '10px 16px',
            borderRadius: 8,
            background: 'var(--success-light, #f0fdf4)',
            color: '#15803D',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {actionResult}
        </div>
      )}

      <div
        className="bg-white overflow-hidden"
        style={{
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--g100)',
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--g100)' }}>
              <th className="px-4 py-3 text-left" style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  style={{ accentColor: 'var(--primary)' }}
                />
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Name
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                E-Mail
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Rolle
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Status
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden md:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Registriert am
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden lg:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Deals
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Aktion
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const sBadge = statusBadge(u.status)
              const rBadge = rolleBadge(u.rolle)
              const userDeals = dealCounts[u.email?.toLowerCase() ?? ''] ?? 0
              return (
                <tr
                  key={u.id}
                  style={{ borderBottom: '1px solid var(--g50)' }}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(u.id)}
                      onChange={() => toggleOne(u.id)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-semibold"
                    style={{ color: 'var(--g800)' }}
                  >
                    <Link
                      href={`/admin/berater/${u.id}`}
                      style={{
                        color: 'var(--primary)',
                        textDecoration: 'none',
                      }}
                    >
                      {u.name}
                    </Link>
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden sm:table-cell"
                    style={{ color: 'var(--g500)' }}
                  >
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: rBadge.bg,
                        color: rBadge.color,
                      }}
                    >
                      {u.rolle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: sBadge.bg,
                        color: sBadge.color,
                      }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden md:table-cell"
                    style={{ color: 'var(--g400)' }}
                  >
                    {new Date(u.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-semibold hidden lg:table-cell"
                    style={{ color: 'var(--g700)' }}
                  >
                    {userDeals}
                  </td>
                  <td className="px-4 py-3">
                    <BeraterStatusToggle
                      userId={u.id}
                      currentStatus={u.status}
                    />
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: 'var(--g400)' }}
                >
                  Keine Benutzer vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {someSelected && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'rgba(17, 24, 39, 0.95)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
            {selected.size} Berater ausgewählt
          </span>
          <button
            onClick={handleBulkInvite}
            disabled={isPending}
            style={{
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              border: 'none',
              background: '#3B82F6',
              color: '#fff',
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? '...' : 'Einladen'}
          </button>
          <button
            onClick={handleBulkDeactivate}
            disabled={isPending}
            style={{
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: '#F87171',
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? '...' : 'Deaktivieren'}
          </button>
        </div>
      )}
    </>
  )
}
