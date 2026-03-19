import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-300">404</h1>
        <p className="text-gray-500">Seite nicht gefunden.</p>
        <Link
          href="/dashboard"
          className="inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Zum Dashboard &rarr;
        </Link>
      </div>
    </div>
  )
}
