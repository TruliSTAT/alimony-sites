import type { Metadata } from 'next'
import { getBrand } from '@/lib/brands'
import CalculatorClient from './CalculatorClient'

const brand = getBrand()

export const metadata: Metadata = {
  title: `Alimony Calculator — Estimate Your ${brand.perspective === 'payor' ? 'Obligation' : 'Entitlement'}`,
  description: `Use our free alimony calculator to estimate potential spousal support amounts for your state. Educational tool — not legal advice.`,
}

export default function CalculatorPage() {
  const isNoAlimony = brand.id === 'noalimony'
  const accentColor = isNoAlimony ? 'text-blue-800' : 'text-teal-800'
  const heroBg = isNoAlimony ? 'from-blue-900 to-slate-900' : 'from-teal-900 to-teal-950'

  return (
    <>
      {/* Header */}
      <section className={`bg-gradient-to-r ${heroBg} text-white py-14 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">{brand.calculatorHeadline}</h1>
          <p className="text-gray-300 text-lg">
            Get a rough estimate based on your state's guidelines.
          </p>
          <div className="inline-block mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2 text-yellow-300 text-sm font-medium">
            ⚠️ Educational estimate only — NOT legal advice
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <CalculatorClient />
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-600 space-y-2">
            <p className="font-semibold text-gray-800">⚠️ Important Disclaimers</p>
            <p>This calculator provides rough educational estimates only. Actual alimony awards are determined by courts based on many factors including but not limited to: specific state statutes, judicial discretion, the couple's standard of living, each spouse's earning capacity, contributions to the marriage, fault (in applicable states), and negotiation between parties.</p>
            <p>This tool does not constitute legal advice and no attorney-client relationship is formed by its use. For accurate guidance specific to your situation, consult a licensed family law attorney in your state.</p>
            <p className={`font-semibold ${isNoAlimony ? 'text-blue-700' : 'text-teal-700'}`}>
              Powered by {brand.siteName} — Legal Marketing Platform
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
