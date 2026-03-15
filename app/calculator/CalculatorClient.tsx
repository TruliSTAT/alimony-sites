'use client'

import { useState } from 'react'
import { STATES } from '@/lib/states'
import { calculateAlimony, type CalculatorInputs, type CalculatorResult } from '@/lib/calculator'
import { getBrand } from '@/lib/brands'
import Link from 'next/link'

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'
const btnBg = isNoAlimony ? 'bg-blue-800 hover:bg-blue-700' : 'bg-violet-700 hover:bg-violet-600'
const accentColor = isNoAlimony ? 'text-blue-800' : 'text-violet-800'
const resultBg = isNoAlimony ? 'from-blue-800 to-slate-900' : 'from-violet-800 to-indigo-950'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function formatMonths(months: number) {
  if (months < 12) return `${months} months`
  const years = Math.round(months / 12 * 10) / 10
  return `${years} year${years !== 1 ? 's' : ''}`
}

export default function CalculatorClient() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    state: '',
    payorIncome: 0,
    payeeIncome: 0,
    yearsMarried: 0,
    assets: 0,
  })
  const [result, setResult] = useState<CalculatorResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setInputs(prev => ({
      ...prev,
      [name]: ['state'].includes(name) ? value : Number(value),
    }))
  }

  const validate = (): string[] => {
    const errs: string[] = []
    if (!inputs.state) errs.push('Please select a state.')
    if (inputs.payorIncome <= 0) errs.push('Higher earner\'s income must be greater than 0.')
    if (inputs.yearsMarried <= 0) errs.push('Years married must be greater than 0.')
    if (inputs.payorIncome < inputs.payeeIncome) errs.push('Higher earner income should be greater than lower earner income.')
    return errs
  }

  const handleCalculate = () => {
    const errs = validate()
    if (errs.length) {
      setErrors(errs)
      return
    }
    setErrors([])
    const res = calculateAlimony(inputs)
    setResult(res)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="card">
        <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900">Enter Your Information</h2>

        <div className="space-y-5">
          <div>
            <label className="label">State *</label>
            <select
              name="state"
              value={inputs.state}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select your state...</option>
              {STATES.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              {isNoAlimony ? 'Your Annual Income (Higher Earner)' : 'Other Spouse\'s Annual Income (Higher Earner)'} *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                name="payorIncome"
                min="0"
                value={inputs.payorIncome || ''}
                onChange={handleChange}
                placeholder="120,000"
                className="input-field pl-7"
              />
            </div>
          </div>

          <div>
            <label className="label">
              {isNoAlimony ? 'Other Spouse\'s Annual Income (Lower Earner)' : 'Your Annual Income (Lower Earner)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                name="payeeIncome"
                min="0"
                value={inputs.payeeIncome || ''}
                onChange={handleChange}
                placeholder="45,000"
                className="input-field pl-7"
              />
            </div>
          </div>

          <div>
            <label className="label">Years Married *</label>
            <input
              type="number"
              name="yearsMarried"
              min="0"
              max="60"
              value={inputs.yearsMarried || ''}
              onChange={handleChange}
              placeholder="12"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Total Marital Assets (Optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                name="assets"
                min="0"
                value={inputs.assets || ''}
                onChange={handleChange}
                placeholder="350,000"
                className="input-field pl-7"
              />
            </div>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              {errors.map((e, i) => (
                <p key={i} className="text-red-600 text-sm">• {e}</p>
              ))}
            </div>
          )}

          <button
            onClick={handleCalculate}
            className={`${btnBg} text-white font-bold px-8 py-4 rounded-xl w-full text-lg transition-colors`}
          >
            Calculate Estimate
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        {result ? (
          <div className={`bg-gradient-to-br ${resultBg} text-white rounded-2xl p-8`}>
            <h3 className="text-xl font-serif font-bold mb-6">
              Estimated {isNoAlimony ? 'Obligation' : 'Award'} — {result.stateName}
            </h3>

            {/* Monthly range */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-2">Estimated Monthly Amount</p>
              <div className="text-4xl font-bold text-white">
                {formatCurrency(result.monthlyLow)} – {formatCurrency(result.monthlyHigh)}
              </div>
              <p className="text-gray-400 text-sm mt-1">per month</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-300 uppercase tracking-wide mb-1">Annual Total</p>
                <p className="text-lg font-bold">
                  {formatCurrency(result.annualLow)} – {formatCurrency(result.annualHigh)}
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-300 uppercase tracking-wide mb-1">Est. Duration</p>
                <p className="text-lg font-bold">{formatMonths(result.estimatedMonths)}</p>
              </div>
            </div>

            {/* State formula */}
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-300 uppercase tracking-wide mb-1">{result.stateName} Approach</p>
              <p className="text-sm text-gray-200">{result.formula}</p>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-6">
              <p className="text-yellow-300 text-xs">{result.disclaimer}</p>
            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className={`${isNoAlimony ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-amber-500 hover:bg-amber-400'} text-white font-bold px-6 py-3 rounded-xl w-full text-center block transition-colors`}
            >
              Get a Free Attorney Consultation
            </Link>
          </div>
        ) : (
          <div className="card h-full flex items-center justify-center text-center text-gray-400 min-h-[400px]">
            <div>
              <div className="text-6xl mb-4">🧮</div>
              <p className="text-lg font-medium">Fill in your details and click Calculate</p>
              <p className="text-sm mt-2">Your estimated range will appear here.</p>
            </div>
          </div>
        )}

        {inputs.state && !result && (
          <div className="mt-4">
            <Link
              href={`/alimony-laws/${STATES.find(s => s.code === inputs.state)?.slug || inputs.state.toLowerCase()}`}
              className={`text-sm ${isNoAlimony ? 'text-blue-700' : 'text-violet-700'} hover:underline`}
            >
              Learn about {STATES.find(s => s.code === inputs.state)?.name} alimony laws →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
