'use client'

import { useState } from 'react'
import { getBrand } from '@/lib/brands'
import LeadForm from './LeadForm'

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'

interface AttorneyWidgetProps {
  attorney?: {
    id: number
    name: string
    firm: string
    phone: string | null
    photo_url: string | null
    bio: string | null
    state: string | null
    zip?: string
  } | null
  userZip?: string | null
}

export default function AttorneyWidget({ attorney, userZip }: AttorneyWidgetProps) {
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  const bgGradient = isNoAlimony
    ? 'from-blue-800 to-blue-900'
    : 'from-teal-800 to-teal-900'

  const accentColor = isNoAlimony ? 'text-sky-300' : 'text-amber-300'
  const ctaBg = isNoAlimony ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-amber-500 hover:bg-amber-400'
  const borderColor = isNoAlimony ? 'border-blue-600' : 'border-teal-600'

  if (!attorney) {
    return (
      <div className={`attorney-widget bg-gradient-to-br ${bgGradient} text-white p-8 rounded-2xl shadow-xl`}>
        <div className="text-center">
          <div className="text-4xl mb-4">⚖️</div>
          <h3 className="text-xl font-serif font-bold mb-2">{brand.noAttorneyMessage}</h3>
          <p className="text-blue-200 text-sm mb-6">
            Enter your information below and we'll connect you with a qualified attorney.
          </p>
          {!showLeadForm ? (
            <button
              onClick={() => setShowLeadForm(true)}
              data-analytics='"Attorney View"'
              className={`${ctaBg} text-white font-semibold px-8 py-3 rounded-lg transition-colors w-full`}
            >
              {brand.heroCTA}
            </button>
          ) : leadSubmitted ? (
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-green-300 font-semibold">✓ Request Submitted!</p>
              <p className="text-sm text-gray-300 mt-1">An attorney will contact you shortly.</p>
            </div>
          ) : (
            <LeadForm
              onSubmit={() => setLeadSubmitted(true)}
              userZip={userZip}
              compact
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`attorney-widget bg-gradient-to-br ${bgGradient} text-white p-6 rounded-2xl shadow-xl border ${borderColor}`}>
      {/* Header badge */}
      <div className={`${accentColor} text-xs font-bold uppercase tracking-wider mb-4`}>
        📍 Attorney Near You
      </div>

      <p className="text-sm text-gray-300 mb-4 italic">{brand.attorneyWidgetIntro}</p>

      {/* Attorney card */}
      <div className="flex items-start space-x-4 mb-6">
        {/* Photo */}
        <div className="flex-shrink-0">
          {attorney.photo_url ? (
            <img
              src={attorney.photo_url}
              alt={attorney.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              👤
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-lg text-white">{attorney.name}</h3>
          <p className={`${accentColor} text-sm font-medium`}>{attorney.firm}</p>
          {attorney.state && (
            <p className="text-gray-400 text-xs mt-0.5">{attorney.state}</p>
          )}
          {attorney.phone && (
            <a
              href={`tel:${attorney.phone}`}
              className="flex items-center space-x-1 mt-2 text-white hover:opacity-80 transition-opacity"
            >
              <span>📞</span>
              <span className="font-semibold">{attorney.phone}</span>
            </a>
          )}
        </div>
      </div>

      {/* Bio */}
      {attorney.bio && (
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{attorney.bio}</p>
      )}

      {/* CTA */}
      {!showLeadForm ? (
        <button
          onClick={() => setShowLeadForm(true)}
          data-analytics='"Attorney View"'
          className={`${ctaBg} text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full`}
        >
          Contact {attorney.name.split(' ')[0]} Now
        </button>
      ) : leadSubmitted ? (
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <p className="text-green-300 font-semibold">✓ Message Sent!</p>
          <p className="text-sm text-gray-300 mt-1">{attorney.name} will contact you shortly.</p>
        </div>
      ) : (
        <LeadForm
          attorneyId={attorney.id}
          onSubmit={() => setLeadSubmitted(true)}
          userZip={userZip}
          compact
        />
      )}

      {/* Disclosure */}
      <p className="text-xs text-gray-500 mt-4 italic">
        Paid attorney placement. Not an endorsement.
      </p>
    </div>
  )
}
