// POST /api/leads
// Captures contact form submissions and stores in DB

import { NextRequest, NextResponse } from 'next/server'
import { createLead } from '@/lib/db'
import { getClientIP } from '@/lib/geo'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, state, situation, zip, attorney_id, brand } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const ip = getClientIP(req.headers)

    const leadId = createLead({
      name,
      email,
      phone: phone || null,
      state: state || null,
      situation: situation || null,
      zip: zip || null,
      attorney_id: attorney_id ? Number(attorney_id) : null,
      brand: brand || process.env.NEXT_PUBLIC_BRAND || 'noalimony',
      ip_address: ip,
    })

    // TODO: Send email notification to attorney (if attorney_id exists)
    // This would use nodemailer or similar with SMTP env vars

    return NextResponse.json({ success: true, leadId })
  } catch (err) {
    console.error('[leads]', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
