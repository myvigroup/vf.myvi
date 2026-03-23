'use client'

import { useState, useRef, useTransition } from 'react'
import * as XLSX from 'xlsx'
import { importBerater } from '../actions'

interface ParsedRow {
  name: string
  email: string
  vermittlerNr: string | null
}

export function ExcelImport() {
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = evt.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet)

      const parsed: ParsedRow[] = json
        .map((row) => {
          // Flexible column matching
          const name =
            row['Name'] || row['name'] || row['Vorname'] || ''
          const email =
            row['E-Mail'] || row['Email'] || row['email'] || row['E-mail'] || row['Mail'] || ''
          const vermittlerNr =
            row['Vermittler-Nr'] ||
            row['Vermittler-Nr.'] ||
            row['VermittlerNr'] ||
            row['Vermittlernummer'] ||
            null

          return { name: String(name).trim(), email: String(email).trim(), vermittlerNr: vermittlerNr ? String(vermittlerNr).trim() : null }
        })
        .filter((r) => r.email)

      setRows(parsed)
      setShowPreview(true)
      setResult(null)
    }
    reader.readAsBinaryString(file)
  }

  function handleImport() {
    startTransition(async () => {
      const res = await importBerater(rows)
      setResult(res)
      setShowPreview(false)
      setRows([])
      if (fileRef.current) fileRef.current.value = ''
    })
  }

  function handleCancel() {
    setShowPreview(false)
    setRows([])
    setResult(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          fontSize: 13,
          fontWeight: 600,
          borderRadius: 8,
          border: '1px solid var(--g200)',
          background: '#fff',
          color: 'var(--g700)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Excel Import
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
      </label>

      {result && (
        <div
          style={{
            marginTop: 12,
            padding: '10px 16px',
            borderRadius: 8,
            background: 'var(--success-light, #f0fdf4)',
            color: '#15803D',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {result.imported} importiert, {result.skipped} übersprungen
        </div>
      )}

      {showPreview && rows.length > 0 && (
        <div
          style={{
            marginTop: 16,
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--g100)',
            background: '#fff',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--g100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--g700)' }}>
              Vorschau: {rows.length} Zeilen
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 6,
                  border: '1px solid var(--g200)',
                  background: '#fff',
                  color: 'var(--g600)',
                  cursor: 'pointer',
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleImport}
                disabled={isPending}
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--primary)',
                  color: '#fff',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.6 : 1,
                }}
              >
                {isPending ? 'Importiere...' : 'Importieren'}
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--g100)' }}>
                <th
                  className="px-4 py-2 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--g400)' }}
                >
                  Name
                </th>
                <th
                  className="px-4 py-2 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--g400)' }}
                >
                  E-Mail
                </th>
                <th
                  className="px-4 py-2 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--g400)' }}
                >
                  Vermittler-Nr
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--g50)' }}>
                  <td className="px-4 py-2 text-sm" style={{ color: 'var(--g800)' }}>
                    {row.name}
                  </td>
                  <td className="px-4 py-2 text-xs" style={{ color: 'var(--g500)' }}>
                    {row.email}
                  </td>
                  <td className="px-4 py-2 text-xs" style={{ color: 'var(--g500)' }}>
                    {row.vermittlerNr || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
