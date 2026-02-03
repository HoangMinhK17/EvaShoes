import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <h1 className="text-5xl font-bold text-slate-900 mb-6 text-center">
          Welcome to EvaShoes
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl text-center">
          Discover our collection of premium quality shoes for every occasion. 
          Visit the frontend application to explore our products.
        </p>
        <div className="flex gap-4">
          <Link
            href="/frontend"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Store
          </Link>
          <a
            href="https://github.com/HoangMinhK17/EvaShoes"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </main>
  )
}
