// GET/POST/DELETE /api/dashboard/zips — Manage zip code subscriptions

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAttorneyByUserId, getZipsByAttorney, addZipCode, removeZipCode } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const attorney = getAttorneyByUserId(session.userId)
  if (!attorney) return NextResponse.json({ zips: [] })

  const zips = getZipsByAttorney(attorney.id)
  return NextResponse.json({ zips })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const attorney = getAttorneyByUserId(session.userId)
  if (!attorney) return NextResponse.json({ error: 'No attorney profile found' }, { status: 400 })

  const body = await req.json()
  const { zip, city, state, tier } = body

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Valid 5-digit zip code required' }, { status: 400 })
  }

  try {
    addZipCode({ zip, city, state, attorney_id: attorney.id, tier: tier || 'exclusive' })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[zips POST]', err)
    return NextResponse.json({ error: 'Failed to add zip code' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const attorney = getAttorneyByUserId(session.userId)
  if (!attorney) return NextResponse.json({ error: 'No attorney profile found' }, { status: 400 })

  const { zip } = await req.json()
  if (!zip) return NextResponse.json({ error: 'Zip required' }, { status: 400 })

  removeZipCode(zip, attorney.id)
  return NextResponse.json({ success: true })
}
