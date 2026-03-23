'use client'

import { useState } from 'react'
import type { SharePointDeal } from '@/lib/types'

const STATUS_BADGES: Record<string, { bg: string; color: string }> = {
  'Neu': { bg: '#EEF2FF', color: '#4338CA' },
  'In Bearbeitung': { bg: 'var(--warning-light)', color: '#B45309' },
  'Angebot erstellt': { bg: 'var(--accent-light)', color: '#0E7490' },
  'Gewonnen': { bg: 'var(--success-light)', color: '#15803D' },
  'Verloren': { bg: 'var(--danger-light)', color: '#B91C1C' },
  'Storniert': { bg: 'var(--g100)', color: 'var(--g500)' },
}

const STATUS_OPTIONS = [
  'Alle',
  'Neu',
  'In Bearbeitung',
  'Angebot erstellt',
  'Gewonnen',
  'Verloren',
  'Storniert',
]

export function DealsTable({ deals }: { deals: SharePointDeal[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Alle')

  const filtered = deals.filter((d) => {
    const matchesSearch =
      !search || d.Title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'Alle' || d.deal_status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Firma suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 14px',
            fontSize: 13,
            border: '1.5px solid var(--g200)',
            borderRadius: 'var(--r-sm)',
            background: '#fff',
            width: 260,
            color: 'var(--g800)',
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 14px',
            fontSize: 13,
            border: '1.5px solid var(--g200)',
            borderRadius: 'var(--r-sm)',
            background: '#fff',
            color: 'var(--g800)',
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span
          className="flex items-center text-xs font-semibold"
          style={{ color: 'var(--g400)' }}
        >
          {filtered.length} Ergebnis{filtered.length !== 1 ? 'se' : ''}
        </span>
      </div>

      {/* Table */}
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
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Firma
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Berater
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
                Deal-Besitzer
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden lg:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Datum
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((deal) => {
              const badge = STATUS_BADGES[deal.deal_status]
              return (
                <tr
                  key={deal.id}
                  style={{ borderBottom: '1px solid var(--g50)' }}
                >
                  <td
                    className="px-4 py-3 text-sm font-semibold"
                    style={{ color: 'var(--g800)' }}
                  >
                    {deal.Title}
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden sm:table-cell"
                    style={{ color: 'var(--g500)' }}
                  >
                    {deal.Berater}
                  </td>
                  <td className="px-4 py-3">
                    {badge ? (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          background: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {deal.deal_status}
                      </span>
                    ) : (
                      <span
                        className="text-xs"
                        style={{ color: 'var(--g400)' }}
                      >
                        {deal.deal_status}
                      </span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden md:table-cell"
                    style={{ color: 'var(--g500)' }}
                  >
                    {deal.Deal_Besitzer || '\u2014'}
                  </td>
                  <td
                    className="px-4 py-3 text-xs hidden lg:table-cell"
                    style={{ color: 'var(--g400)' }}
                  >
                    {new Date(deal.Created).toLocaleDateString('de-DE')}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: 'var(--g400)' }}
                >
                  Keine Deals gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
