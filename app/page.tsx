import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div
          className="mx-auto flex items-center justify-center rounded-2xl text-white font-bold text-2xl"
          style={{ width: 56, height: 56, background: 'var(--primary)' }}
        >
          VF
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--g900)' }}>
            Value Factory
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--g400)' }}>
            Berater-Dashboard für Firmenkontakte
          </p>
        </div>
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
