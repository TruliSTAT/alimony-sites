// GET/PUT /api/dashboard/attorney — Manage attorney profile

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAttorneyByUserId, upsertAttorney } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const attorney = getAttorneyByUserId(session.userId)
  return NextResponse.json({ attorney: attorney || null })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, firm, email, phone, bio, photo_url, state } = body

    if (!name || !firm || !email) {
      return NextResponse.json({ error: 'Name, firm, and email required' }, { status: 400 })
    }

    const id = upsertAttorney({
      user_id: session.userId,
      name,
      firm,
      email,
      phone: phone || null,
      bio: bio || null,
      photo_url: photo_url || null,
      state: state || null,
    })

    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error('[dashboard/attorney PUT]', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
