import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">MYVI Dialog</h1>
        <p className="text-gray-500">
          Berater-Dashboard für Firmenkontakte
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Anmelden
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-gray-50"
          >
            Registrieren
          </Link>
        </div>
      </div>
    </div>
  )
}
