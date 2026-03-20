import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <div className="text-center space-y-6">
        <img src="/logo.png" alt="Value Factory" className="mx-auto" style={{ height: 48 }} />
        <p className="text-sm" style={{ color: 'var(--g400)' }}>
          Berater-Dashboard für Firmenkontakte
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ background: 'var(--primary)' }}
          >
            Anmelden
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ border: '1px solid var(--g200)', color: 'var(--g600)' }}
          >
            Registrieren
          </Link>
        </div>
      </div>
    </div>
  )
}
