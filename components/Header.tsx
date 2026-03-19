'use client'

import Link from 'next/link'
import { BrandConfig } from '@/lib/brands'
import { useState } from 'react'

export default function Header({ brand }: { brand: BrandConfig }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const isNoAlimony = brand.id === 'noalimony'
  const primaryColor = isNoAlimony ? 'bg-blue-800' : 'bg-teal-800'
  const accentColor = isNoAlimony ? 'text-sky-300' : 'text-amber-300'
  const ctaBg = isNoAlimony ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-amber-500 hover:bg-amber-400'

  return (
    <header className={`${primaryColor} text-white shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-serif font-bold">
              <span className={accentColor}>{brand.siteName.split('.')[0]}</span>
              <span className="text-gray-300">.com</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="text-gray-200 hover:text-white transition-colors">Home</Link>
            <Link href="/calculator" className="text-gray-200 hover:text-white transition-colors">Calculator</Link>
            <Link href="/alimony-laws/california" className="text-gray-200 hover:text-white transition-colors">State Laws</Link>
            <Link href="/about" className="text-gray-200 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-gray-200 hover:text-white transition-colors">Contact</Link>
            <Link href="/dashboard" className="text-gray-200 hover:text-white transition-colors">Attorney Login</Link>
            <Link href="/contact" className={`${ctaBg} text-white px-4 py-2 rounded-lg font-semibold transition-colors`}>
              {brand.heroCTA}
            </Link>
          </nav>

          <button className="md:hidden p-2 rounded-md text-gray-200 hover:text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className={`md:hidden pb-4 ${primaryColor}`}>
            <div className="flex flex-col space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/calculator', label: 'Calculator' },
                { href: '/alimony-laws/california', label: 'State Laws' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
                { href: '/dashboard', label: 'Attorney Login' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="px-4 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded" onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
