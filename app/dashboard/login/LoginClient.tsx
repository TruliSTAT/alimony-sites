'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBrand } from '@/lib/brands'
import Link from 'next/link'

const brand = getBrand()
const isNoAlimony = brand.id === 'noalimony'
const heroBg = isNoAlimony ? 'from-blue-900 to-slate-900' : 'from-teal-900 to-teal-950'
const btnBg = isNoAlimony ? 'bg-blue-700 hover:bg-blue-600' : 'bg-teal-700 hover:bg-teal-600'
const accentColor = isNoAlimony ? 'text-sky-400' : 'text-amber-400'

export default function LoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${heroBg} flex items-center justify-center px-4`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className={`text-2xl font-serif font-bold text-white`}>
            <span className={accentColor}>{brand.siteName.split('.')[0]}</span>
            <span className="text-gray-400">.com</span>
          </Link>
          <h1 className="text-white text-xl font-semibold mt-4">Attorney Portal Login</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your profile, zip codes, and leads</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@lawfirm.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${btnBg} text-white font-bold px-6 py-3 rounded-xl w-full transition-colors disabled:opacity-60 text-lg`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>New law firm? <span className="text-gray-700 font-medium">Contact us to get set up.</span></p>
          </div>

          {/* Dev hint */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <strong>Demo:</strong> Use the seeded credentials from your <code>.env.local</code> file.<br />
            Default: <code>admin@noalimony.com</code> / <code>changeme123</code>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Link href="/" className="hover:text-white transition-colors">← Back to {brand.siteName}</Link>
        </p>
      </div>
    </div>
  )
}
