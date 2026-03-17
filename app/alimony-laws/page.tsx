import type { Metadata } from 'next'
import Link from 'next/link'
import { STATES } from '@/lib/states'
import { getBrand } from '@/lib/brands'

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'

export const metadata: Metadata = {
  title: `Alimony Laws by State — All 50 States | ${brand.siteName}`,
  description: 'Complete guide to alimony and spousal support laws in all 50 states. Find your state to learn about types of alimony, duration limits, how courts calculate support, and more.',
}

export default function AlimonyLawsIndexPage() {
  const accentColor = isNoAlimony ? 'text-blue-700' : 'text-teal-700'
  const hoverBorder = isNoAlimony ? 'hover:border-blue-400 hover:bg-blue-50' : 'hover:border-teal-400 hover:bg-teal-50'
  const heroBg = isNoAlimony
    ? 'from-blue-900 via-blue-800 to-slate-900'
    : 'from-teal-900 via-teal-800 to-teal-950'

  return (
    <>
      {/* Hero */}
      <section className={`bg-gradient-to-br ${heroBg} text-white py-14 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${isNoAlimony ? 'text-blue-300' : 'text-teal-300'}`}>
            50-State Guide
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Alimony Laws by State
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Alimony rules vary dramatically from state to state. Select your state to learn about
            spousal support types, duration limits, and how courts calculate payments.
          </p>
        </div>
      </section>

      {/* All 50 States Grid */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {STATES.map(state => (
              <Link
                key={state.slug}
                href={`/alimony-laws/${state.slug}`}
                className={`p-4 rounded-lg border border-gray-200 text-center font-medium transition-colors ${hoverBorder} text-gray-700 hover:text-gray-900`}
              >
                <span className="block text-xs font-bold text-gray-400 mb-1">{state.code}</span>
                <span className="text-sm leading-tight">{state.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section className="py-10 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-xl font-serif font-bold mb-2 ${accentColor}`}>
            Not sure where to start?
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Use our free calculator to estimate alimony obligations or entitlements, then connect
            with a licensed attorney in your state for a personalized review.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/calculator"
              className={`${isNoAlimony ? 'bg-blue-800 hover:bg-blue-700' : 'bg-teal-700 hover:bg-teal-600'} text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors`}
            >
              Try the Calculator
            </Link>
            <Link
              href="/contact"
              className={`border-2 ${isNoAlimony ? 'border-blue-700 text-blue-700 hover:bg-blue-50' : 'border-teal-700 text-teal-700 hover:bg-teal-50'} font-bold px-6 py-3 rounded-xl text-sm transition-colors`}
            >
              Find an Attorney
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="py-4 px-4 bg-white border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center max-w-3xl mx-auto">
          {brand.siteName} is a legal marketing platform. Content is for informational purposes only and does not constitute legal advice. Laws change frequently — consult a licensed attorney in your state for current guidance. This is attorney advertising.
        </p>
      </div>
    </>
  )
}
