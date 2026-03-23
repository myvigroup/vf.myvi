import { createAdminClient } from '@/lib/supabase/admin'
import { NewCodeForm } from './new-code-form'
import { CodeDeactivateButton } from './code-deactivate-button'

export default async function AdminEinladungenPage() {
  const supabase = createAdminClient()

  const { data: codes } = await supabase
    .from('invitation_codes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <h1 className="text-xl font-bold mb-5" style={{ color: 'var(--g900)' }}>
        Einladungscodes
      </h1>

      {/* New Code Form */}
      <div
        className="bg-white p-5 mb-5"
        style={{
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--g100)',
        }}
      >
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-4"
          style={{ color: 'var(--g400)' }}
        >
          Neuen Code erstellen
        </h2>
        <NewCodeForm />
      </div>

      {/* Codes Table */}
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
                Code
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Label
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Nutzung
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider hidden sm:table-cell"
                style={{ color: 'var(--g400)' }}
              >
                Ablauf
              </th>
              <th
                className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--g400)' }}
              >
                Status
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
            {codes?.map((c) => (
              <tr
                key={c.id}
                className={c.aktiv ? '' : 'opacity-50'}
                style={{ borderBottom: '1px solid var(--g50)' }}
              >
                <td
                  className="px-4 py-3 text-sm font-mono font-bold"
                  style={{ color: 'var(--g800)' }}
                >
                  {c.code}
                </td>
                <td
                  className="px-4 py-3 text-xs hidden sm:table-cell"
                  style={{ color: 'var(--g500)' }}
                >
                  {c.label ?? '\u2014'}
                </td>
                <td
                  className="px-4 py-3 text-xs"
                  style={{ color: 'var(--g500)' }}
                >
                  {c.used_count} / {c.max_uses}
                </td>
                <td
                  className="px-4 py-3 text-xs hidden sm:table-cell"
                  style={{ color: 'var(--g500)' }}
                >
                  {c.expires_at
                    ? new Date(c.expires_at).toLocaleDateString('de-DE')
                    : '\u2014'}
                </td>
                <td className="px-4 py-3">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background: c.aktiv
                        ? 'var(--success-light)'
                        : 'var(--g100)',
                      color: c.aktiv ? '#15803D' : 'var(--g500)',
                    }}
                  >
                    {c.aktiv ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {c.aktiv && (
                    <CodeDeactivateButton codeId={c.id} />
                  )}
                </td>
              </tr>
            ))}
            {(!codes || codes.length === 0) && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: 'var(--g400)' }}
                >
                  Keine Codes vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
