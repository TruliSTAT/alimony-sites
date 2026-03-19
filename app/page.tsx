export const dynamic = 'force-dynamic'

import { getBrandServer } from '@/lib/getBrandServer'
import GeoAttorneyLoader from '@/components/GeoAttorneyLoader'
import Link from 'next/link'
import { STATES } from '@/lib/states'

export default async function HomePage() {
  const brand = await getBrandServer()

  if (brand.id === 'noalimony') {
    return <NoAlimonyPage brand={brand} />
  }
  return <KnowAlimonyPage brand={brand} />
}

// ─────────────────────────────────────────────
// NoAlimony.com -- Payor/Defender perspective
// Blue. Sharp. Strategic.
// ─────────────────────────────────────────────
function NoAlimonyPage({ brand }: { brand: any }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sky-400 text-sm font-bold uppercase tracking-widest mb-4">
                {brand.tagline}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
                {brand.heroHeadline}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {brand.heroSubheadline}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg">
                  {brand.heroCTA}
                </Link>
                <Link href="/calculator" className="border-2 border-sky-400 text-sky-400 hover:bg-sky-400/10 font-bold px-8 py-4 rounded-xl text-lg transition-colors">
                  {brand.heroSecondaryCTA}
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
                {['Free attorney matching', 'All 50 states covered', 'No upfront commitment'].map(t => (
                  <div key={t} className="flex items-center space-x-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div><GeoAttorneyLoader /></div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-slate-800 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: '70%', label: 'Of alimony orders can be modified with the right legal strategy' },
            { value: '40%', label: 'Of alimony terminates within 5 years when challenged properly' },
            { value: '$0', label: 'Cost for an initial consultation with a defense attorney' },
          ].map(stat => (
            <div key={stat.value}>
              <div className="text-4xl font-bold text-sky-400 mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why fight back */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">Alimony Doesn't Have to Be Forever</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Courts can modify or terminate alimony. You have legal options -- but only if you act.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              {
                icon: '📉',
                title: 'Modification',
                desc: 'A substantial change in income, employment, or financial circumstances is grounds to seek a reduction. Courts routinely lower payments when circumstances warrant it.',
              },
              {
                icon: '🚫',
                title: 'Termination',
                desc: 'Alimony can end when the recipient remarries, cohabitates with a new partner, becomes financially self-sufficient, or upon a set termination date in your order.',
              },
              {
                icon: '⚖️',
                title: 'Appeal & Defense',
                desc: 'If you believe the original order was unjust, an experienced attorney can identify legal grounds for appeal or negotiate a settlement that reduces your total liability.',
              },
            ].map(item => (
              <div key={item.title} className="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-serif font-bold mb-3 text-blue-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">How to Start Fighting Back</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">Three steps to connect with an attorney who can reduce or eliminate your obligation.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              { step: '01', icon: '📍', title: 'Enter Your Location', desc: 'We find attorneys licensed in your jurisdiction who specialize in payor defense and alimony modification.' },
              { step: '02', icon: '⚖️', title: 'Get Matched Instantly', desc: 'Our system surfaces a qualified local attorney with a track record of reducing spousal support obligations.' },
              { step: '03', icon: '📞', title: 'Free Strategy Session', desc: 'Get a confidential case review. Understand your options before committing to anything.' },
            ].map(item => (
              <div key={item.step} className="text-center p-8 rounded-2xl border border-blue-100 bg-white hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">Step {item.step}</div>
                <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">Your Defense Toolkit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              { icon: '🧮', title: 'Obligation Calculator', desc: 'Estimate your current exposure and model scenarios for reduction.', href: '/calculator' },
              { icon: '📚', title: '50 State Laws', desc: 'Understand how your state handles modification, termination, and remarriage clauses.', href: '/alimony-laws/california' },
              { icon: '👨‍⚖️', title: 'Defense Attorneys', desc: 'Local attorneys who specialize in reducing and eliminating spousal support.', href: '/contact' },
              { icon: '❓', title: 'FAQs', desc: 'Answers to the most common questions payors ask about fighting alimony orders.', href: '/about' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="card hover:shadow-xl transition-shadow group">
                <div className="bg-blue-800 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4">{item.icon}</div>
                <h3 className="font-serif font-bold text-lg mb-2 text-blue-900 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* State laws */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Alimony Laws by State</h2>
              <p className="text-gray-600">Modification and termination rules vary by state. Know yours.</p>
            </div>
            <Link href="/alimony-laws" className="text-sm font-semibold text-blue-700 hover:underline">All 50 States →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {STATES.map(state => (
              <Link key={state.slug} href={`/alimony-laws/${state.slug}`}
                className="p-3 rounded-lg border border-gray-200 text-center text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-900"
              >
                <span className="block text-xs font-bold text-gray-500 mb-0.5">{state.code}</span>
                <span className="text-xs leading-tight">{state.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Protect What You've Earned?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Don't keep paying more than the law requires. A defense attorney will review your case -- free.
          </p>
          <Link href="/contact" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg inline-block">
            {brand.heroCTA} -- Free Consultation
          </Link>
          <p className="text-xs text-gray-500 mt-6">
            NoAlimony.com is a legal marketing platform. Attorney advertising. Not legal advice.
          </p>
        </div>
      </section>
    </>
  )
}

// ─────────────────────────────────────────────
// KnowAlimony.com -- Recipient/Advocate perspective
// Teal. Empowering. Rights-focused.
// ─────────────────────────────────────────────
function KnowAlimonyPage({ brand }: { brand: any }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-4">
                {brand.tagline}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
                {brand.heroHeadline}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {brand.heroSubheadline}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg">
                  {brand.heroCTA}
                </Link>
                <Link href="/calculator" className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400/10 font-bold px-8 py-4 rounded-xl text-lg transition-colors">
                  {brand.heroSecondaryCTA}
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
                {['Free attorney matching', 'All 50 states covered', 'No commitment required'].map(t => (
                  <div key={t} className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div><GeoAttorneyLoader /></div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-teal-950 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: '400K+', label: 'Americans receive alimony awards each year' },
            { value: '60%', label: 'Of eligible recipients never seek what they deserve' },
            { value: '$0', label: 'Cost for a free consultation with an advocate attorney' },
          ].map(stat => (
            <div key={stat.value}>
              <div className="text-4xl font-bold text-amber-400 mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Rights sections */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">You Have the Right to Fair Support</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Alimony is a legal right for qualifying spouses. An attorney can help you pursue every dollar you're entitled to.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              {
                icon: '💰',
                title: 'Securing an Award',
                desc: 'Courts consider the length of marriage, lifestyle, earning capacity, and sacrifices made. An attorney builds the strongest case for the award you deserve.',
              },
              {
                icon: '📈',
                title: 'Enforcement',
                desc: "If your ex isn't paying, you have legal remedies -- including wage garnishment, contempt proceedings, and liens. Don't let missed payments slide.",
              },
              {
                icon: '🔄',
                title: 'Modification',
                desc: "If your ex's income increases or your needs change, you can petition to modify the award upward. Your attorney can file for a post-divorce modification.",
              },
            ].map(item => (
              <div key={item.title} className="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-serif font-bold mb-3 text-teal-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-teal-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">How to Find Your Advocate</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">Three steps to connect with an attorney who will fight for your financial future.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              { step: '01', icon: '📍', title: 'Enter Your Location', desc: 'We find attorneys in your jurisdiction who specialize in securing fair alimony awards for recipients.' },
              { step: '02', icon: '⚖️', title: 'Get Matched Instantly', desc: 'Our system connects you with a local advocate with experience winning alimony and enforcement cases.' },
              { step: '03', icon: '📞', title: 'Free Consultation', desc: 'Speak confidentially with your matched attorney and understand your rights before committing to anything.' },
            ].map(item => (
              <div key={item.step} className="text-center p-8 rounded-2xl border border-teal-100 bg-white hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-sm font-bold text-teal-600 uppercase tracking-wide mb-2">Step {item.step}</div>
                <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">Know Your Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              { icon: '🧮', title: 'Entitlement Calculator', desc: "Estimate the alimony support you may be entitled to based on your state's guidelines.", href: '/calculator' },
              { icon: '📚', title: '50 State Laws', desc: 'Know the laws in your state -- types of alimony, duration, and modification rules.', href: '/alimony-laws/california' },
              { icon: '👩‍⚖️', title: 'Advocate Attorneys', desc: 'Local attorneys who specialize in securing and enforcing spousal support awards.', href: '/contact' },
              { icon: '❓', title: 'Know Your Rights', desc: "Guides and FAQs to help you understand what you're entitled to and how to pursue it.", href: '/about' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="card hover:shadow-xl transition-shadow group">
                <div className="bg-teal-800 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4">{item.icon}</div>
                <h3 className="font-serif font-bold text-lg mb-2 text-teal-900 group-hover:text-teal-700 transition-colors">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* State laws */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Alimony Laws by State</h2>
              <p className="text-gray-600">Your state's laws determine your rights. Find yours below.</p>
            </div>
            <Link href="/alimony-laws" className="text-sm font-semibold text-teal-700 hover:underline">All 50 States →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {STATES.map(state => (
              <Link key={state.slug} href={`/alimony-laws/${state.slug}`}
                className="p-3 rounded-lg border border-gray-200 text-center text-sm font-medium hover:border-teal-400 hover:bg-teal-50 transition-colors text-gray-700 hover:text-teal-900"
              >
                <span className="block text-xs font-bold text-gray-500 mb-0.5">{state.code}</span>
                <span className="text-xs leading-tight">{state.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-950 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Fight for What You Deserve?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Don't settle for less than the law provides. Connect with an advocate attorney today.
          </p>
          <Link href="/contact" className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg inline-block">
            {brand.heroCTA} -- Free Consultation
          </Link>
          <p className="text-xs text-gray-500 mt-6">
            KnowAlimony.com is a legal marketing platform. Attorney advertising. Not legal advice.
          </p>
        </div>
      </section>
    </>
  )
}
