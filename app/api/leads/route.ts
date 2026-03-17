// POST /api/leads
// Captures contact form submissions and stores in DB

import { NextRequest, NextResponse } from 'next/server'
import { createLead, checkDuplicateLead } from '@/lib/db'
import { getClientIP } from '@/lib/geo'
import { validateLead } from '@/lib/validateLead'
import { notifyNewLead } from '@/lib/notify'

export const dynamic = 'force-dynamic'

// ── In-memory rate limiting (max 3 submissions per IP per hour) ──────────────
const ipSubmissions = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const max = 3
  const timestamps = (ipSubmissions.get(ip) || []).filter(t => now - t < windowMs)
  if (timestamps.length >= max) return false
  timestamps.push(now)
  ipSubmissions.set(ip, timestamps)
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req.headers)

    // ── Rate limit ─────────────────────────────────────────────────────────────
    if (!checkRateLimit(ip)) {
      console.warn(`[leads] Rate limit exceeded for IP ${ip}`)
      return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const { name, email, phone, state, situation, zip, attorney_id, brand } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const siteBrand = brand || process.env.NEXT_PUBLIC_BRAND || 'noalimony'

    // ── Lead quality validation ────────────────────────────────────────────────
    const validation = validateLead({ name, email, phone, zip, issue_description: situation })

    // ── Duplicate check ───────────────────────────────────────────────────────
    const isDuplicate = checkDuplicateLead(email, phone || null, siteBrand)
    if (isDuplicate) {
      validation.flags.push('duplicate_24h')
      validation.score = Math.max(0, validation.score - 40)
    }

    const finalScore = validation.score
    const finalValid = finalScore >= 40

    if (!finalValid) {
      console.warn(`[leads] Rejected lead from ${ip} — score ${finalScore} — flags: ${validation.flags.join(', ')}`)
      return NextResponse.json({ error: 'Invalid submission', flags: validation.flags }, { status: 400 })
    }

    const qualityFlag = finalScore >= 70 ? 'good' : 'review'

    // TODO: Send [LOW QUALITY] prefix to attorney notification when qualityFlag === 'review'

    const leadId = createLead({
      name,
      email,
      phone: phone || null,
      state: state || null,
      situation: situation || null,
      zip: zip || null,
      attorney_id: attorney_id ? Number(attorney_id) : null,
      brand: siteBrand,
      ip_address: ip,
      quality_score: finalScore,
      quality_flag: qualityFlag,
    })

    // ── Fire notifications (non-blocking) ─────────────────────────────────────
    notifyNewLead({
      leadId,
      name,
      email,
      phone: phone || null,
      state: state || null,
      situation: situation || null,
      zip: zip || null,
      brand: siteBrand,
      quality_score: finalScore,
      quality_flag: qualityFlag,
    }).catch(err => console.error('[notify] notification error:', err))

    return NextResponse.json({ success: true, leadId })
  } catch (err) {
    console.error('[leads]', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
