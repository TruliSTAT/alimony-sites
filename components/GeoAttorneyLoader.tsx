'use client'

import { useEffect, useState } from 'react'
import AttorneyWidget from './AttorneyWidget'

interface Attorney {
  id: number
  name: string
  firm: string
  phone: string | null
  photo_url: string | null
  bio: string | null
  state: string | null
  zip?: string
}

export default function GeoAttorneyLoader() {
  const [attorney, setAttorney] = useState<Attorney | null | undefined>(undefined)
  const [userZip, setUserZip] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGeoAttorney() {
      try {
        const res = await fetch('/api/geo-attorney')
        if (res.ok) {
          const data = await res.json()
          setAttorney(data.attorney || null)
          setUserZip(data.zip || null)
        } else {
          setAttorney(null)
        }
      } catch {
        setAttorney(null)
      } finally {
        setLoading(false)
      }
    }

    fetchGeoAttorney()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-16 bg-gray-700 rounded mb-4"></div>
        <div className="h-10 bg-gray-700 rounded"></div>
      </div>
    )
  }

  return <AttorneyWidget attorney={attorney} userZip={userZip} />
}
