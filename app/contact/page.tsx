import type { Metadata } from 'next'
import { getBrand } from '@/lib/brands'
import LeadForm from '@/components/LeadForm'
import GeoAttorneyLoader from '@/components/GeoAttorneyLoader'

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'

export const metadata: Metadata = {
  title: `Contact — Find an Attorney | ${brand.siteName}`,
  description: `Connect with a qualified family law attorney in your area. ${brand.siteName} matches you with local legal experts.`,
}

export default function ContactPage() {
  const heroBg = isNoAlimony ? 'from-blue-900 to-slate-900' : 'from-violet-900 to-indigo-950'

  return (
    <>
      <section className={`bg-gradient-to-r ${heroBg} text-white py-14 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">{brand.heroCTA}</h1>
          <p className="text-gray-300 text-lg">{brand.subTagline}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Lead form */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Tell Us About Your Situation</h2>
            <div className={`bg-gradient-to-br ${heroBg} rounded-2xl p-8`}>
              <LeadForm />
            </div>
          </div>

          {/* Attorney widget */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Your Local Attorney Match</h2>
            <GeoAttorneyLoader />

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <p>Free initial consultation — no commitment required</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <p>Licensed attorney in your jurisdiction</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <p>Confidential — your information is protected</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
