// ============================================================
// notify.ts — Lead notification via Twilio SMS + Resend email
// Fires on every new lead submission
// ============================================================

interface LeadData {
  leadId: number
  name: string
  email: string
  phone?: string | null
  state?: string | null
  situation?: string | null
  zip?: string | null
  brand: string
  quality_score: number
  quality_flag: string
}

// ── Twilio SMS ────────────────────────────────────────────────────────────────
export async function sendLeadSMS(lead: LeadData): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken  = process.env.TWILIO_AUTH_TOKEN
  const fromPhone  = process.env.TWILIO_PHONE_NUMBER
  const toPhone    = process.env.LEAD_NOTIFY_PHONE

  if (!accountSid || !authToken || !fromPhone || !toPhone) {
    console.warn('[notify] Twilio env vars missing — skipping SMS')
    return
  }

  const siteName = lead.brand === 'knowalimony' ? 'KnowAlimony.com' : 'NoAlimony.com'
  const qualityTag = lead.quality_flag === 'good' ? '✅' : '⚠️'
  const body = [
    `${qualityTag} New Lead — ${siteName}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.state ? `State: ${lead.state}` : null,
    `Score: ${lead.quality_score}/100`,
    `Lead #${lead.leadId}`,
  ].filter(Boolean).join('\n')

  const params = new URLSearchParams({
    From: fromPhone,
    To: toPhone,
    Body: body,
  })

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error('[notify] Twilio SMS failed:', err)
  } else {
    console.log(`[notify] SMS sent to ${toPhone} for lead #${lead.leadId}`)
  }
}

// ── Resend Email ──────────────────────────────────────────────────────────────
export async function sendLeadEmail(lead: LeadData): Promise<void> {
  const apiKey   = process.env.RESEND_API_KEY
  const fromAddr = process.env.LEAD_NOTIFY_FROM_EMAIL || 'leads@knowlegalleads.com'
  const toAddr   = process.env.LEAD_NOTIFY_EMAIL

  if (!apiKey || !toAddr) {
    console.warn('[notify] Resend env vars missing — skipping email')
    return
  }

  const siteName = lead.brand === 'knowalimony' ? 'KnowAlimony.com' : 'NoAlimony.com'
  const qualityBadge = lead.quality_flag === 'good' ? '✅ Good Lead' : '⚠️ Review Lead'

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #0ABAB5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h2 style="margin:0">New Lead — ${siteName}</h2>
    <p style="margin:4px 0 0; opacity:0.85">${qualityBadge} &nbsp;|&nbsp; Score: ${lead.quality_score}/100 &nbsp;|&nbsp; Lead #${lead.leadId}</p>
  </div>
  <div style="background: #f9f9f9; padding: 20px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <table style="width:100%; border-collapse: collapse;">
      <tr><td style="padding:8px 0; color:#666; width:120px">Name</td><td style="padding:8px 0; font-weight:bold">${lead.name}</td></tr>
      <tr><td style="padding:8px 0; color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
      ${lead.phone ? `<tr><td style="padding:8px 0; color:#666">Phone</td><td style="padding:8px 0"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>` : ''}
      ${lead.state ? `<tr><td style="padding:8px 0; color:#666">State</td><td style="padding:8px 0">${lead.state}</td></tr>` : ''}
      ${lead.zip ? `<tr><td style="padding:8px 0; color:#666">ZIP</td><td style="padding:8px 0">${lead.zip}</td></tr>` : ''}
      ${lead.situation ? `<tr><td style="padding:8px 0; color:#666; vertical-align:top">Situation</td><td style="padding:8px 0">${lead.situation}</td></tr>` : ''}
    </table>
    <hr style="border:none; border-top:1px solid #eee; margin:16px 0">
    <p style="color:#999; font-size:12px; margin:0">
      Lead ID: ${lead.leadId} &nbsp;|&nbsp; Brand: ${lead.brand} &nbsp;|&nbsp; Quality: ${lead.quality_score}/100<br>
      Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT
    </p>
  </div>
</body>
</html>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddr,
      to: [toAddr],
      subject: `[${siteName}] New Lead: ${lead.name} (${lead.state || 'no state'})`,
      html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[notify] Resend email failed:', err)
  } else {
    console.log(`[notify] Email sent to ${toAddr} for lead #${lead.leadId}`)
  }
}

// ── Combined notifier ─────────────────────────────────────────────────────────
export async function notifyNewLead(lead: LeadData): Promise<void> {
  // Fire both in parallel, don't block lead response on either
  await Promise.allSettled([
    sendLeadSMS(lead),
    sendLeadEmail(lead),
  ])
}
