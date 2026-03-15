import { getBrand } from '@/lib/brands'
import GeoAttorneyLoader from '@/components/GeoAttorneyLoader'
import Link from 'next/link'
import { STATES } from '@/lib/states'

// State flag images from CivilServiceUSA public repo
const STATE_SLUGS: Record<string, string> = {
  AL:'alabama', AK:'alaska', AZ:'arizona', AR:'arkansas', CA:'california',
  CO:'colorado', CT:'connecticut', DE:'delaware', FL:'florida', GA:'georgia',
  HI:'hawaii', ID:'idaho', IL:'illinois', IN:'indiana', IA:'iowa',
  KS:'kansas', KY:'kentucky', LA:'louisiana', ME:'maine', MD:'maryland',
  MA:'massachusetts', MI:'michigan', MN:'minnesota', MS:'mississippi', MO:'missouri',
  MT:'montana', NE:'nebraska', NV:'nevada', NH:'new-hampshire', NJ:'new-jersey',
  NM:'new-mexico', NY:'new-york', NC:'north-carolina', ND:'north-dakota', OH:'ohio',
  OK:'oklahoma', OR:'oregon', PA:'pennsylvania', RI:'rhode-island', SC:'south-carolina',
  SD:'south-dakota', TN:'tennessee', TX:'texas', UT:'utah', VT:'vermont',
  VA:'virginia', WA:'washington', WV:'west-virginia', WI:'wisconsin', WY:'wyoming'
}

function getStateFlagUrl(code: string): string {
  const slug = STATE_SLUGS[code]
  if (!slug) return ''
  return `https://raw.githubusercontent.com/CivilServiceUSA/us-states/master/images/flags/${slug}-flag-small.jpg`
}

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'

const heroBg = isNoAlimony
  ? 'from-blue-900 via-blue-800 to-slate-900'
  : 'from-violet-900 via-violet-800 to-indigo-950'

const accentColor = isNoAlimony ? 'text-sky-400' : 'text-amber-400'
const ctaBg = isNoAlimony ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-amber-500 hover:bg-amber-400'
const secondaryBtn = isNoAlimony
  ? 'border-sky-400 text-sky-400 hover:bg-sky-400/10'
  : 'border-amber-400 text-amber-400 hover:bg-amber-400/10'

const featuresBg = isNoAlimony ? 'bg-blue-50' : 'bg-violet-50'
const featureIconBg = isNoAlimony ? 'bg-blue-800' : 'bg-violet-800'

export default function HomePage() {
  const featuredStates = STATES

  return (
    <>
      {/* Hero */}
      <section className={`bg-gradient-to-br ${heroBg} text-white py-20 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div>
              <div className={`${accentColor} text-sm font-bold uppercase tracking-widest mb-4`}>
                {brand.tagline}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
                {brand.heroHeadline}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {brand.heroSubheadline}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className={`${ctaBg} text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg`}
                >
                  {brand.heroCTA}
                </Link>
                <Link
                  href="/calculator"
                  className={`border-2 ${secondaryBtn} font-bold px-8 py-4 rounded-xl text-lg transition-colors`}
                >
                  {brand.heroSecondaryCTA}
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Free attorney matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>All 50 states covered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>No commitment required</span>
                </div>
              </div>
            </div>

            {/* Geo-fenced attorney widget */}
            <div>
              <GeoAttorneyLoader />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">How It Works</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            {isNoAlimony
              ? 'Three simple steps to protect your financial future.'
              : 'Three simple steps to secure the support you deserve.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              {
                step: '01',
                title: 'Enter Your Location',
                desc: 'We automatically detect your location to find attorneys licensed in your jurisdiction.',
                icon: '📍',
              },
              {
                step: '02',
                title: 'Get Matched Instantly',
                desc: 'Our system matches you with a qualified local attorney who specializes in your situation.',
                icon: '⚖️',
              },
              {
                step: '03',
                title: 'Free Consultation',
                desc: 'Connect directly with your matched attorney for a confidential case evaluation.',
                icon: '📞',
              },
            ].map(item => (
              <div key={item.step} className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className={`text-sm font-bold ${isNoAlimony ? 'text-blue-600' : 'text-violet-600'} uppercase tracking-wide mb-2`}>
                  Step {item.step}
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`py-16 px-4 ${featuresBg}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">
            {isNoAlimony ? 'Fight Back With Knowledge' : 'Know Your Rights'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              {
                icon: '🧮',
                title: 'Alimony Calculator',
                desc: 'Estimate your potential obligation or entitlement with our state-specific calculator.',
                href: '/calculator',
              },
              {
                icon: '📚',
                title: '50 State Laws',
                desc: 'Comprehensive guides to alimony laws in every US state.',
                href: '/alimony-laws/california',
              },
              {
                icon: '👨‍⚖️',
                title: 'Local Attorneys',
                desc: 'Geofenced attorney matching puts a local expert front and center.',
                href: '/contact',
              },
              {
                icon: '📋',
                title: 'Free Resources',
                desc: 'Guides, FAQs, and educational content to help you understand your situation.',
                href: '/about',
              },
            ].map(item => (
              <Link key={item.href} href={item.href} className="card hover:shadow-xl transition-shadow group">
                <div className={`${featureIconBg} text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-serif font-bold text-lg mb-2 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* State laws preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">State Alimony Laws</h2>
              <p className="text-gray-600">Laws vary significantly by state. Find your state below.</p>
            </div>
            <Link
              href="/alimony-laws/california"
              className={`text-sm font-semibold ${isNoAlimony ? 'text-blue-700' : 'text-violet-700'} hover:underline`}
            >
              View All 50 States →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {featuredStates.map(state => (
              <Link
                key={state.slug}
                href={`/alimony-laws/${state.slug}`}
                className={`p-3 rounded-lg border text-center text-sm font-medium transition-colors hover:border-${isNoAlimony ? 'blue' : 'violet'}-400 hover:bg-${isNoAlimony ? 'blue' : 'violet'}-50 border-gray-200 text-gray-700 hover:text-gray-900`}
              >
                <img
                  src={getStateFlagUrl(state.code)}
                  alt={`${state.name} flag`}
                  className="w-12 h-7 object-cover rounded mx-auto mb-1 shadow-sm border border-gray-200"
                  onError={(e) => { (e.target as HTMLImageElement).style.display='none' }}
                />
                <span className="block text-xs font-bold text-gray-400">{state.code}</span>
                <span className="text-xs">{state.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`bg-gradient-to-r ${heroBg} text-white py-16 px-4`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            {isNoAlimony
              ? 'Ready to Protect What You\'ve Earned?'
              : 'Ready to Fight for What You Deserve?'}
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            {isNoAlimony
              ? 'Don\'t face alimony alone. Connect with a strategic attorney in your area today.'
              : 'Don\'t settle for less than you deserve. Find your advocate today.'}
          </p>
          <Link
            href="/contact"
            className={`${ctaBg} text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg inline-block`}
          >
            {brand.heroCTA} — Free Consultation
          </Link>

          <p className="text-xs text-gray-500 mt-6">
            {brand.siteLabel} is a legal marketing platform. This is attorney advertising. Not legal advice.
          </p>
        </div>
      </section>
    </>
  )
}
