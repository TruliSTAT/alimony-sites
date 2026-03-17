import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getStateBySlug, getAllStateSlugs, STATES } from '@/lib/states'
import { getBrand } from '@/lib/brands'
import Link from 'next/link'
import GeoAttorneyLoader from '@/components/GeoAttorneyLoader'

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'

interface Props {
  params: { state: string }
}

export async function generateStaticParams() {
  return getAllStateSlugs().map(slug => ({ state: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const state = getStateBySlug(params.state)
  if (!state) return { title: 'State Not Found' }

  return {
    title: `${state.name} Alimony Laws ${new Date().getFullYear()} — Complete Guide`,
    description: `Comprehensive guide to alimony laws in ${state.name}. Learn about ${state.alimonyType.join(', ')}, duration limits, how courts calculate support, and more.`,
  }
}

export default function StatePage({ params }: Props) {
  const state = getStateBySlug(params.state)
  if (!state) notFound()

  const heroBg = isNoAlimony ? 'from-blue-900 to-slate-900' : 'from-teal-900 to-teal-950'
  const accentColor = isNoAlimony ? 'text-sky-400' : 'text-amber-400'
  const tagBg = isNoAlimony ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'
  const linkColor = isNoAlimony ? 'text-blue-700' : 'text-teal-700'

  const currentYear = new Date().getFullYear()

  return (
    <>
      {/* Hero */}
      <section className={`bg-gradient-to-r ${heroBg} text-white py-14 px-4`}>
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {' / '}
            <span>Alimony Laws</span>
            {' / '}
            <span className="text-white">{state.name}</span>
          </nav>
          <h1 className="text-4xl font-serif font-bold mb-3">
            {state.name} Alimony Laws {currentYear}
          </h1>
          <p className={`${accentColor} text-lg`}>
            Complete guide to spousal support in {state.name}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick facts */}
            <div className="card">
              <h2 className="text-2xl font-serif font-bold mb-6">{state.name} Alimony at a Glance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Types Available</p>
                  <div className="flex flex-wrap gap-2">
                    {state.alimonyType.map(type => (
                      <span key={type} className={`text-xs font-medium px-2 py-1 rounded-full ${tagBg}`}>{type}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Maximum Duration</p>
                  <p className="font-semibold text-gray-900">{state.maxDuration}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">How Courts Calculate</p>
                  <p className="font-semibold text-gray-900">{state.formula}</p>
                </div>
              </div>
            </div>

            {/* Detailed overview */}
            <div className="card">
              <h2 className="text-2xl font-serif font-bold mb-4">
                Understanding {state.name} Alimony Law
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  In {state.name}, alimony (also called spousal support or spousal maintenance) is financial support paid by one spouse to the other following a divorce or separation. {state.notes}
                </p>
                <p>
                  {state.name} courts generally consider the following factors when determining alimony:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>The length of the marriage</li>
                  <li>Each spouse's income and earning capacity</li>
                  <li>The standard of living established during the marriage</li>
                  <li>Each spouse's age, health, and employability</li>
                  <li>Contributions to the marriage (including homemaking)</li>
                  <li>Child custody arrangements and their impact on earning capacity</li>
                  {state.code !== 'CA' && state.code !== 'WA' && state.code !== 'NV' && (
                    <li>Marital misconduct or fault (in some cases)</li>
                  )}
                </ul>

                <h3 className="text-xl font-serif font-bold mt-6 mb-3">
                  Types of Alimony in {state.name}
                </h3>
                {state.alimonyType.map(type => (
                  <div key={type}>
                    <p>
                      <strong>{type}:</strong>{' '}
                      {type.toLowerCase().includes('rehabilitative') && 'Designed to support a spouse while they gain education or job skills to become self-sufficient. Typically has a defined end date tied to the completion of a training program or return to the workforce.'}
                      {type.toLowerCase().includes('permanent') && 'Ongoing support with no set end date, typically awarded in long marriages where one spouse has limited earning capacity. May be modified or terminated upon changed circumstances.'}
                      {type.toLowerCase().includes('transitional') && 'Short-term support to help a spouse transition to independent living after divorce.'}
                      {type.toLowerCase().includes('reimbursement') && 'Compensates a spouse for financial contributions made to the other spouse\'s education or career advancement during the marriage.'}
                      {type.toLowerCase().includes('lump') && 'A one-time payment of the total alimony amount, rather than ongoing periodic payments.'}
                      {type.toLowerCase().includes('periodic') && 'Regular (usually monthly) payments over a defined or indefinite period.'}
                      {!['rehabilitative', 'permanent', 'transitional', 'reimbursement', 'lump', 'periodic'].some(t => type.toLowerCase().includes(t)) && `Available under ${state.name} law based on the specific circumstances of each case.`}
                    </p>
                  </div>
                ))}

                <h3 className="text-xl font-serif font-bold mt-6 mb-3">Duration of Alimony</h3>
                <p>
                  In {state.name}, the duration of alimony awards is: <strong>{state.maxDuration}</strong>.
                  {state.code === 'CA' && ' California courts apply a general rule that alimony lasts approximately half the length of the marriage for marriages under 10 years. For marriages of 10 years or longer, the court retains jurisdiction indefinitely.'}
                  {state.code === 'TX' && ' Texas has some of the most restrictive alimony statutes in the country. To qualify, the receiving spouse must typically be unable to meet minimum reasonable needs and either have a disability, be the custodial parent of a disabled child, or the paying spouse must have been convicted of family violence.'}
                </p>

                <h3 className="text-xl font-serif font-bold mt-6 mb-3">Modifying or Terminating Alimony</h3>
                <p>
                  In most cases, alimony in {state.name} can be modified or terminated upon a showing of a substantial change in circumstances, such as:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Significant increase or decrease in either party's income</li>
                  <li>Recipient spouse's remarriage</li>
                  <li>Recipient spouse's cohabitation with a new partner (in many states)</li>
                  <li>Either party's retirement</li>
                  <li>Death of either party</li>
                </ul>
              </div>
            </div>

            {/* Calculator CTA */}
            <div className={`card border-2 ${isNoAlimony ? 'border-blue-200 bg-blue-50' : 'border-teal-200 bg-teal-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl mb-2">
                    Estimate Your {state.name} Alimony
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Use our calculator to get a rough estimate based on {state.name} guidelines.
                  </p>
                </div>
                <Link
                  href={`/calculator?state=${state.code}`}
                  className={`${isNoAlimony ? 'bg-blue-800 hover:bg-blue-700' : 'bg-teal-700 hover:bg-teal-600'} text-white font-bold px-6 py-3 rounded-xl transition-colors flex-shrink-0 ml-4`}
                >
                  Calculate →
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Geo attorney widget */}
            <GeoAttorneyLoader />

            {/* Other states */}
            <div className="card">
              <h3 className="font-serif font-bold mb-4">Other State Laws</h3>
              <div className="space-y-1">
                {STATES.filter(s => s.slug !== state.slug).slice(0, 10).map(s => (
                  <Link
                    key={s.slug}
                    href={`/alimony-laws/${s.slug}`}
                    className={`block text-sm ${linkColor} hover:underline py-0.5`}
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice. Laws change frequently. Consult a licensed {state.name} family law attorney for advice specific to your situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
