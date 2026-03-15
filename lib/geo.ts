// ============================================================
// geo.ts — IP geolocation via ipapi.co (free tier)
// Detects visitor zip code for attorney geofencing
// ============================================================

export interface GeoResult {
  ip: string
  city: string | null
  region: string | null
  country: string | null
  postal: string | null   // zip code
  latitude: number | null
  longitude: number | null
  error?: string
}

/**
 * Look up location for an IP address via ipapi.co
 * Free tier: 1,000 requests/day — no key required
 * With key (IPAPI_KEY env var): 30,000/month
 */
export async function geolocateIP(ip: string): Promise<GeoResult> {
  // Skip private/loopback IPs in development
  if (isPrivateIP(ip)) {
    return {
      ip,
      city: null,
      region: null,
      country: null,
      postal: null,
      latitude: null,
      longitude: null,
      error: 'private_ip',
    }
  }

  try {
    const key = process.env.IPAPI_KEY
    const url = key
      ? `https://ipapi.co/${ip}/json/?key=${key}`
      : `https://ipapi.co/${ip}/json/`

    const res = await fetch(url, {
      headers: { 'User-Agent': 'alimony-sites/1.0' },
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!res.ok) {
      throw new Error(`ipapi.co returned ${res.status}`)
    }

    const data = await res.json()

    if (data.error) {
      return { ip, city: null, region: null, country: null, postal: null, latitude: null, longitude: null, error: data.reason }
    }

    return {
      ip,
      city: data.city || null,
      region: data.region || null,
      country: data.country_name || null,
      postal: data.postal || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    }
  } catch (err) {
    console.error('[geo] geolocation failed:', err)
    return {
      ip,
      city: null,
      region: null,
      country: null,
      postal: null,
      latitude: null,
      longitude: null,
      error: err instanceof Error ? err.message : 'unknown',
    }
  }
}

/**
 * Extract the real client IP from Next.js request headers
 * Handles Cloudflare, Vercel, and direct connections
 */
export function getClientIP(headers: Headers | Record<string, string | string[] | undefined>): string {
  const get = (key: string): string | null => {
    if (headers instanceof Headers) {
      return headers.get(key)
    }
    const val = headers[key]
    if (Array.isArray(val)) return val[0] || null
    return val || null
  }

  return (
    get('cf-connecting-ip') ||       // Cloudflare
    get('x-real-ip') ||              // Nginx
    get('x-forwarded-for')?.split(',')[0]?.trim() ||  // Proxies
    '127.0.0.1'
  )
}

function isPrivateIP(ip: string): boolean {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return true
  // RFC1918 private ranges
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^::1$/,
    /^fc00:/,
    /^fe80:/,
  ]
  return privateRanges.some(r => r.test(ip))
}
