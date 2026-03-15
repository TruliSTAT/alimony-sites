// GET /api/dashboard/leads — View leads for logged-in attorney

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAttorneyByUserId, getLeadsByAttorney, getLeadCount } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const attorney = getAttorneyByUserId(session.userId)
  if (!attorney) return NextResponse.json({ leads: [], count: 0 })

  const leads = getLeadsByAttorney(attorney.id)
  const count = getLeadCount(attorney.id)

  return NextResponse.json({ leads, count })
}
