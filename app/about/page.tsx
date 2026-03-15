import type { Metadata } from 'next'
import { getBrand } from '@/lib/brands'
import Link from 'next/link'

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'

export const metadata: Metadata = {
  title: `About ${brand.siteName}`,
  description: `Learn about ${brand.siteName} and our mission to connect people with qualified family law attorneys.`,
}

export default function AboutPage() {
  const heroBg = isNoAlimony ? 'from-blue-900 to-slate-900' : 'from-violet-900 to-indigo-950'
  const accentColor = isNoAlimony ? 'text-sky-400' : 'text-amber-400'

  return (
    <>
      <section className={`bg-gradient-to-r ${heroBg} text-white py-14 px-4`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-4">About {brand.siteName}</h1>
          <p className={`${accentColor} text-lg`}>{brand.subTagline}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-gray max-w-none space-y-6 text-gray-700">
          <div className="card">
            <h2 className="text-2xl font-serif font-bold mb-4">Our Mission</h2>
            <p>
              {brand.siteName} was built to bridge the gap between people navigating complex alimony disputes and the qualified legal professionals who can help them. We believe that access to the right attorney — specifically one who specializes in your situation — can make a profound difference in the outcome of your case.
            </p>
            <p>
              {isNoAlimony
                ? 'We focus on helping individuals who are facing alimony obligations find strategic legal counsel to minimize unfair or excessive spousal support requirements.'
                : 'We focus on empowering alimony recipients to understand their rights and connect with advocates who will fight for the support they\'ve earned and deserve.'}
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-serif font-bold mb-4">How Our Platform Works</h2>
            <p>
              {brand.siteName} is a legal marketing platform that connects visitors with licensed family law attorneys in their geographic area. We use advanced geolocation technology to automatically identify attorneys who are subscribed to serve your zip code area — so you're always seeing a real, local attorney who is ready to take your case.
            </p>
            <p>
              Our attorneys are real law firms that have purchased subscriptions to display their profiles to visitors in their service areas. We do not manufacture or fabricate attorney profiles.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-serif font-bold mb-4">Important Disclosures</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Attorney Advertising:</strong> This is a legal marketing platform. Attorney profiles represent paid placements.</li>
              <li><strong>Not Legal Advice:</strong> Content on this site is educational only and does not constitute legal advice.</li>
              <li><strong>No Attorney-Client Relationship:</strong> Using this site does not create an attorney-client relationship.</li>
              <li><strong>Paid Placement Disclosure (FTC):</strong> Attorney profiles are paid subscriptions. Placement is determined by subscription tier and geographic targeting.</li>
              <li><strong>UPL Disclaimer:</strong> {brand.siteName} is not a law firm and does not practice law.</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-serif font-bold mb-4">For Law Firms</h2>
            <p>
              Are you a family law attorney looking to expand your practice? {brand.siteName} offers exclusive zip code subscriptions that display your firm's profile to visitors in your service area. Our geofencing technology ensures your profile is seen by the right people at the right time.
            </p>
            <Link
              href="/dashboard"
              className={`inline-block mt-4 ${isNoAlimony ? 'bg-blue-800 hover:bg-blue-700' : 'bg-violet-700 hover:bg-violet-600'} text-white font-semibold px-6 py-3 rounded-lg transition-colors`}
            >
              Attorney Portal →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
