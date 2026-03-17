'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBrand } from '@/lib/brands'
import type { Attorney, ZipCode } from '@/lib/db'
import type { SessionPayload } from '@/lib/auth'

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'
const navBg = isNoAlimony ? 'bg-blue-800' : 'bg-teal-800'
const activeBg = isNoAlimony ? 'bg-blue-900' : 'bg-teal-900'
const btnBg = isNoAlimony ? 'bg-blue-700 hover:bg-blue-600' : 'bg-teal-700 hover:bg-teal-600'
const accentColor = isNoAlimony ? 'text-sky-400' : 'text-amber-400'

interface Props {
  session: SessionPayload
  attorney: Attorney | null
  leadCount: number
  initialZips: ZipCode[]
}

type Tab = 'overview' | 'profile' | 'zips' | 'leads'

export default function DashboardClient({ session, attorney: initialAttorney, leadCount, initialZips }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [attorney, setAttorney] = useState(initialAttorney)
  const [zips, setZips] = useState(initialZips)
  const [profile, setProfile] = useState({
    name: initialAttorney?.name || '',
    firm: initialAttorney?.firm || '',
    email: initialAttorney?.email || session.email,
    phone: initialAttorney?.phone || '',
    bio: initialAttorney?.bio || '',
    photo_url: initialAttorney?.photo_url || '',
    state: initialAttorney?.state || '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [newZip, setNewZip] = useState('')
  const [zipCity, setZipCity] = useState('')
  const [zipState, setZipState] = useState('')
  const [zipTier, setZipTier] = useState('exclusive')
  const [zipMsg, setZipMsg] = useState('')
  const [leads, setLeads] = useState<any[]>([])
  const [leadsLoaded, setLeadsLoaded] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/dashboard/login')
    router.refresh()
  }

  const handleProfileSave = async () => {
    setProfileSaving(true)
    setProfileMsg('')
    try {
      const res = await fetch('/api/dashboard/attorney', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setProfileMsg('✓ Profile saved successfully!')
        router.refresh()
      } else {
        const data = await res.json()
        setProfileMsg(`Error: ${data.error}`)
      }
    } catch {
      setProfileMsg('Failed to save. Please try again.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleAddZip = async () => {
    if (!newZip || !/^\d{5}$/.test(newZip)) {
      setZipMsg('Please enter a valid 5-digit zip code.')
      return
    }
    setZipMsg('')
    try {
      const res = await fetch('/api/dashboard/zips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip: newZip, city: zipCity, state: zipState, tier: zipTier }),
      })
      if (res.ok) {
        setZipMsg(`✓ Zip code ${newZip} added!`)
        setNewZip('')
        setZipCity('')
        setZipState('')
        // Refresh zip list
        const data = await fetch('/api/dashboard/zips').then(r => r.json())
        setZips(data.zips || [])
      } else {
        const data = await res.json()
        setZipMsg(`Error: ${data.error}`)
      }
    } catch {
      setZipMsg('Failed to add zip code.')
    }
  }

  const handleRemoveZip = async (zip: string) => {
    try {
      const res = await fetch('/api/dashboard/zips', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip }),
      })
      if (res.ok) {
        setZips(prev => prev.filter(z => z.zip !== zip))
      }
    } catch {
      // silent
    }
  }

  const loadLeads = async () => {
    if (leadsLoaded) return
    const data = await fetch('/api/dashboard/leads').then(r => r.json())
    setLeads(data.leads || [])
    setLeadsLoaded(true)
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'zips', label: 'Zip Codes', icon: '📍' },
    { id: 'leads', label: 'Leads', icon: '📋' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard header */}
      <div className={`${navBg} text-white py-4 px-6 flex items-center justify-between`}>
        <div>
          <h1 className="font-serif font-bold text-xl">{brand.siteName} — Attorney Portal</h1>
          <p className="text-sm text-gray-300">{session.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-300 hover:text-white border border-white/20 px-4 py-2 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar nav */}
          <div className="lg:w-56 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    if (tab.id === 'leads') loadLeads()
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center space-x-3 ${
                    activeTab === tab.id
                      ? `${activeBg} text-white shadow`
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold">Dashboard Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Leads', value: leadCount, icon: '📋' },
                    { label: 'Zip Codes', value: zips.length, icon: '📍' },
                    { label: 'Profile Status', value: attorney ? 'Active' : 'Incomplete', icon: '✓' },
                  ].map(stat => (
                    <div key={stat.label} className="card text-center">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {!attorney && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Complete Your Profile</h3>
                    <p className="text-yellow-700 text-sm mb-4">
                      Your attorney profile is not yet set up. Set up your profile to start receiving leads.
                    </p>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`${btnBg} text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors`}
                    >
                      Set Up Profile →
                    </button>
                  </div>
                )}

                <div className="card">
                  <h3 className="font-serif font-bold text-lg mb-3">Getting Started</h3>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start space-x-3">
                      <span className={`${isNoAlimony ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'} rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0`}>1</span>
                      <div>
                        <strong>Complete your profile</strong> — Add your name, firm, photo, and bio.
                        <button onClick={() => setActiveTab('profile')} className={`ml-2 ${accentColor} hover:underline`}>Go →</button>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className={`${isNoAlimony ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'} rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0`}>2</span>
                      <div>
                        <strong>Subscribe to zip codes</strong> — Add zip codes in your service area.
                        <button onClick={() => setActiveTab('zips')} className={`ml-2 ${accentColor} hover:underline`}>Go →</button>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className={`${isNoAlimony ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'} rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0`}>3</span>
                      <div>
                        <strong>Start receiving leads</strong> — Your profile appears automatically to visitors in your zip codes.
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold">My Attorney Profile</h2>
                <div className="card">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { name: 'name', label: 'Full Name *', placeholder: 'Jane Smith, Esq.' },
                      { name: 'firm', label: 'Firm Name *', placeholder: 'Smith Family Law' },
                      { name: 'email', label: 'Contact Email *', placeholder: 'jane@smithlaw.com' },
                      { name: 'phone', label: 'Phone Number', placeholder: '(555) 123-4567' },
                      { name: 'state', label: 'State (Licensed)', placeholder: 'CA' },
                      { name: 'photo_url', label: 'Photo URL', placeholder: 'https://...' },
                    ].map(field => (
                      <div key={field.name}>
                        <label className="label">{field.label}</label>
                        <input
                          type="text"
                          value={(profile as any)[field.name]}
                          onChange={e => setProfile(prev => ({ ...prev, [field.name]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="input-field"
                        />
                      </div>
                    ))}

                    <div className="sm:col-span-2">
                      <label className="label">Bio / About</label>
                      <textarea
                        value={profile.bio}
                        onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Brief description of your practice and expertise..."
                        rows={4}
                        className="input-field resize-none"
                      />
                    </div>
                  </div>

                  {profileMsg && (
                    <p className={`mt-4 text-sm ${profileMsg.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
                      {profileMsg}
                    </p>
                  )}

                  <button
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                    className={`${btnBg} text-white font-semibold px-6 py-3 rounded-lg transition-colors mt-6 disabled:opacity-60`}
                  >
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            )}

            {/* Zip codes */}
            {activeTab === 'zips' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold">Zip Code Subscriptions</h2>

                {/* Add zip */}
                <div className="card">
                  <h3 className="font-serif font-bold text-lg mb-4">Add a Zip Code</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="label">Zip Code *</label>
                      <input
                        type="text"
                        value={newZip}
                        onChange={e => setNewZip(e.target.value.slice(0, 5))}
                        placeholder="90210"
                        maxLength={5}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">City</label>
                      <input
                        type="text"
                        value={zipCity}
                        onChange={e => setZipCity(e.target.value)}
                        placeholder="Beverly Hills"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">State</label>
                      <input
                        type="text"
                        value={zipState}
                        onChange={e => setZipState(e.target.value.slice(0, 2).toUpperCase())}
                        placeholder="CA"
                        maxLength={2}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Tier</label>
                      <select
                        value={zipTier}
                        onChange={e => setZipTier(e.target.value)}
                        className="input-field"
                      >
                        <option value="exclusive">Exclusive ($99/mo)</option>
                        <option value="shared">Shared ($49/mo)</option>
                      </select>
                    </div>
                  </div>

                  {zipMsg && (
                    <p className={`text-sm mb-3 ${zipMsg.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
                      {zipMsg}
                    </p>
                  )}

                  <button
                    onClick={handleAddZip}
                    className={`${btnBg} text-white font-semibold px-6 py-2.5 rounded-lg transition-colors`}
                  >
                    Add Zip Code
                  </button>
                </div>

                {/* Current zips */}
                <div className="card">
                  <h3 className="font-serif font-bold text-lg mb-4">
                    Active Zip Codes ({zips.length})
                  </h3>
                  {zips.length === 0 ? (
                    <p className="text-gray-500 text-sm">No zip codes added yet. Add zip codes above to start appearing to visitors.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b">
                            <th className="pb-2 font-medium">Zip</th>
                            <th className="pb-2 font-medium">City</th>
                            <th className="pb-2 font-medium">State</th>
                            <th className="pb-2 font-medium">Tier</th>
                            <th className="pb-2 font-medium">Price</th>
                            <th className="pb-2 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {zips.map(z => (
                            <tr key={z.id}>
                              <td className="py-2 font-mono font-bold">{z.zip}</td>
                              <td className="py-2 text-gray-600">{z.city || '—'}</td>
                              <td className="py-2 text-gray-600">{z.state || '—'}</td>
                              <td className="py-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${z.tier === 'exclusive' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {z.tier}
                                </span>
                              </td>
                              <td className="py-2 text-gray-700">${z.price_monthly}/mo</td>
                              <td className="py-2">
                                <button
                                  onClick={() => handleRemoveZip(z.zip)}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Leads */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold">Leads ({leadCount})</h2>
                <div className="card">
                  {!leadsLoaded ? (
                    <p className="text-gray-500">Loading leads...</p>
                  ) : leads.length === 0 ? (
                    <p className="text-gray-500 text-sm">No leads yet. Make sure your profile is complete and you have active zip codes.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b">
                            <th className="pb-2 font-medium">Name</th>
                            <th className="pb-2 font-medium">Email</th>
                            <th className="pb-2 font-medium">Phone</th>
                            <th className="pb-2 font-medium">State</th>
                            <th className="pb-2 font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {leads.map((lead: any) => (
                            <tr key={lead.id}>
                              <td className="py-2 font-medium">{lead.name}</td>
                              <td className="py-2 text-blue-600">
                                <a href={`mailto:${lead.email}`}>{lead.email}</a>
                              </td>
                              <td className="py-2 text-gray-600">{lead.phone || '—'}</td>
                              <td className="py-2 text-gray-600">{lead.state || '—'}</td>
                              <td className="py-2 text-gray-500 text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
