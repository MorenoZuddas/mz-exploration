'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-blue-100 transition">
          🏃 Running Analytics
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded transition">
            Home
          </Link>
          <Link href="/about" className="hover:bg-blue-700 px-3 py-2 rounded transition">
            Chi Sono
          </Link>
          <Link href="/gallery" className="hover:bg-blue-700 px-3 py-2 rounded transition">
            Percorsi
          </Link>
          <Link href="/contact" className="hover:bg-blue-700 px-3 py-2 rounded transition">
            Contatti
          </Link>
          <Link
            href="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-50 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}