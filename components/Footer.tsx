import Link from 'next/link'
import { getBrand } from '@/lib/brands'
import { STATES } from '@/lib/states'

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'
const footerBg = isNoAlimony ? 'bg-slate-900' : 'bg-indigo-950'
const accentColor = isNoAlimony ? 'text-sky-400' : 'text-amber-400'


export default function Footer() {
  const featuredStates = STATES.filter(s =>
    ['california', 'new-york', 'florida', 'texas', 'illinois'].includes(s.slug)
  )

  return (
    <footer className={`${footerBg} text-gray-300`}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className={`text-xl font-serif font-bold ${accentColor} mb-3`}>
              {brand.siteName}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">{brand.description}</p>
            <a href="https://knowlegalleads.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-xs text-gray-500 hover:text-gray-300 transition-colors group">
              <span className="text-amber-500 font-bold tracking-tight group-hover:text-amber-400">⚖</span>
              <span>Powered by <span className="font-semibold">KnowLegalLeads.com</span></span>
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/calculator" className="hover:text-white transition-colors">Alimony Calculator</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Attorney Portal</Link></li>
            </ul>
          </div>

          {/* State Laws */}
          <div>
            <h4 className="text-white font-semibold mb-4">State Alimony Laws</h4>
            <ul className="space-y-2 text-sm">
              {featuredStates.map(s => (
                <li key={s.slug}>
                  <Link href={`/alimony-laws/${s.slug}`} className="hover:text-white transition-colors">
                    {s.name} Alimony Laws
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/alimony-laws/california" className={`${accentColor} hover:opacity-80 transition-colors`}>
                  View All 50 States →
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Legal Disclaimer</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-xs text-gray-500 space-y-2">
            <p>
              <strong className="text-gray-400">Attorney Advertising Disclosure:</strong> {brand.siteName} is a legal marketing platform connecting individuals with licensed attorneys. Attorney listings are paid placements. This site does not endorse any particular attorney.
            </p>
            <p>
              <strong className="text-gray-400">Not Legal Advice:</strong> The information on this website is for general informational purposes only and does not constitute legal advice. Laws vary by state. No attorney-client relationship is formed by using this site. Consult a licensed attorney in your jurisdiction for advice specific to your situation.
            </p>
            <p>
              <strong className="text-gray-400">FTC Disclosure:</strong> Attorney profiles displayed on this site represent paid subscribers. Placement is determined by subscription and geographic targeting.
            </p>
            <p className="mt-4 text-gray-600">
              © {new Date().getFullYear()} {brand.siteName}. All rights reserved. Powered by{' '}
              <a href="https://knowlegalleads.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-gray-400 transition-colors">KnowLegalLeads.com</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
