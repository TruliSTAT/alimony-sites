// GET /api/geo-attorney
// Detects visitor IP, looks up zip code, returns matched attorney

import { NextRequest, NextResponse } from 'next/server'
import { geolocateIP, getClientIP } from '@/lib/geo'
import { getAttorneyByZip } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIP(req.headers)
    const geo = await geolocateIP(ip)

    if (!geo.postal) {
      return NextResponse.json({ attorney: null, zip: null, geo })
    }

    const attorney = getAttorneyByZip(geo.postal)

    return NextResponse.json({
      attorney: attorney ? {
        id: attorney.id,
        name: attorney.name,
        firm: attorney.firm,
        phone: attorney.phone,
        photo_url: attorney.photo_url,
        bio: attorney.bio,
        state: attorney.state,
        zip: attorney.zip,
      } : null,
      zip: geo.postal,
      city: geo.city,
      state: geo.region,
    })
  } catch (err) {
    console.error('[geo-attorney]', err)
    return NextResponse.json({ attorney: null, zip: null }, { status: 200 })
  }
}
