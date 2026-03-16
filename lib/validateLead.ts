// ============================================================
// validateLead.ts — Lead quality scoring & validation
// Protects law firm clients from garbage/spam leads
// ============================================================

export interface LeadValidationResult {
  valid: boolean
  score: number // 0–100; below 40 = reject, 40–69 = review, 70+ = good
  flags: string[]
}

// 30+ known disposable/temp email providers
export const DISPOSABLE_DOMAINS = [
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.info',
  'guerrillamail.biz',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  '10minutemail.net',
  'throwaway.email',
  'yopmail.com',
  'yopmail.fr',
  'spam4.me',
  'trashmail.com',
  'trashmail.at',
  'trashmail.me',
  'trashmail.net',
  'trashmail.io',
  'fakeinbox.com',
  'mailnull.com',
  'maildrop.cc',
  'spamgourmet.com',
  'dispostable.com',
  'mailexpire.com',
  'spamex.com',
  'spamfree24.org',
  'spamhole.com',
  'spamspot.com',
  'mailnesia.com',
  'tempr.email',
  'discard.email',
  'throam.com',
  'tempinbox.com',
  'getairmail.com',
  'mailnew.com',
  'trillianpro.com',
  'zetmail.com',
]

// Known fake/test phone numbers (normalized to 10 digits)
const FAKE_PHONES = new Set([
  '5551234567',
  '5550000000',
  '0000000000',
  '1234567890',
  '1111111111',
  '2222222222',
  '3333333333',
  '4444444444',
  '5555555555',
  '6666666666',
  '7777777777',
  '8888888888',
  '9999999999',
  '1231231234',
  '0123456789',
])

// Junk name values
const JUNK_NAMES = new Set([
  'test', 'asdf', 'qwerty', 'xxxx', 'foo', 'bar', 'baz',
  'fake', 'aaa', 'asd', 'abc', 'xyz', 'testing', 'tester',
  'user', 'name', 'nope', 'nnn', 'zzz', 'qqq',
])

// Junk description values
const JUNK_DESCRIPTIONS = new Set([
  'test', 'asdf', 'na', 'n/a', 'nothing', 'none',
  'no', 'hi', 'hello', 'ok', 'okay', '.', '...', 'idk',
  'yes', 'no idea', 'dunno', '???',
])

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  // Strip leading 1 (country code) if 11 digits starting with 1
  return digits.length === 11 && digits[0] === '1' ? digits.slice(1) : digits
}

function isAllSameDigit(s: string): boolean {
  return s.length > 0 && s.split('').every(c => c === s[0])
}

export function validateLead(data: {
  name: string
  email: string
  phone?: string
  zip?: string
  issue_description?: string
}): LeadValidationResult {
  const flags: string[] = []
  let score = 100

  // ── Name ────────────────────────────────────────────────────────────────────
  const name = (data.name || '').trim()
  if (name.length < 2) {
    flags.push('name_too_short')
    score -= 25
  } else if (/^[a-zA-Z]$/.test(name)) {
    flags.push('name_single_letter')
    score -= 25
  } else if (/^\d+$/.test(name)) {
    flags.push('name_all_numbers')
    score -= 25
  } else if (JUNK_NAMES.has(name.toLowerCase())) {
    flags.push('name_junk')
    score -= 25
  }

  // ── Email ────────────────────────────────────────────────────────────────────
  const email = (data.email || '').trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(email)) {
    flags.push('email_invalid_format')
    score -= 30
  } else {
    const domain = email.split('@')[1]
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      flags.push('email_disposable')
      score -= 30
    }
  }

  // ── Phone ────────────────────────────────────────────────────────────────────
  if (data.phone) {
    const digits = normalizePhone(data.phone)
    if (digits.length !== 10) {
      flags.push('phone_invalid_length')
      score -= 20
    } else if (FAKE_PHONES.has(digits)) {
      flags.push('phone_known_fake')
      score -= 20
    } else if (isAllSameDigit(digits)) {
      flags.push('phone_all_same_digit')
      score -= 20
    }
  }

  // ── Zip ──────────────────────────────────────────────────────────────────────
  if (data.zip) {
    if (!/^\d{5}$/.test(data.zip.trim())) {
      flags.push('zip_invalid_format')
      score -= 10
    }
  }

  // ── Issue description ────────────────────────────────────────────────────────
  if (data.issue_description) {
    const desc = data.issue_description.trim()
    if (desc.length < 10) {
      flags.push('description_too_short')
      score -= 10
    } else if (JUNK_DESCRIPTIONS.has(desc.toLowerCase())) {
      flags.push('description_junk')
      score -= 10
    }
  }

  score = Math.max(0, score)
  return {
    valid: score >= 40,
    score,
    flags,
  }
}
