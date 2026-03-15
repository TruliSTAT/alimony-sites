'use client'

import { useState } from 'react'
import { getBrand } from '@/lib/brands'
import { STATES } from '@/lib/states'

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'
const submitBg = isNoAlimony ? 'bg-blue-600 hover:bg-blue-500' : 'bg-violet-600 hover:bg-violet-500'

interface LeadFormProps {
  attorneyId?: number
  userZip?: string | null
  onSubmit?: () => void
  compact?: boolean
}

export default function LeadForm({ attorneyId, userZip, onSubmit, compact = false }: LeadFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    situation: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          attorney_id: attorneyId,
          zip: userZip,
          brand: brand.id,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Submission failed')
      }

      setSubmitted(true)
      onSubmit?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className="text-green-400 font-semibold text-lg">✓ Request Submitted!</p>
        <p className="text-gray-300 text-sm mt-1">An attorney will reach out to you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-3' : 'space-y-4'}>
      <div className={compact ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="(555) 000-0000"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">State *</label>
          <select
            name="state"
            required
            value={form.state}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="" className="bg-gray-800">Select state...</option>
            {STATES.map(s => (
              <option key={s.code} value={s.code} className="bg-gray-800">{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!compact && (
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Brief Situation</label>
          <textarea
            name="situation"
            value={form.situation}
            onChange={handleChange}
            placeholder="Briefly describe your situation..."
            rows={3}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
          />
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`${submitBg} text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full disabled:opacity-60`}
      >
        {loading ? 'Submitting...' : brand.heroCTA}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By submitting, you consent to being contacted by an attorney. No attorney-client relationship is formed.
      </p>
    </form>
  )
}
