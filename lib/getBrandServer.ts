import { headers } from 'next/headers'
import { brands, BrandConfig } from './brands'

/**
 * Server-side brand detection using x-forwarded-host (set by CF Worker).
 * Use in server components and layouts.
 */
export async function getBrandServer(): Promise<BrandConfig> {
  const headersList = await headers()
  const host =
    headersList.get('x-forwarded-host') ||
    headersList.get('host') ||
    ''
  const domain = host.split(':')[0].replace(/^www\./, '').toLowerCase()

  if (domain === 'noalimony.com') return brands['noalimony']
  if (domain === 'knowalimony.com') return brands['knowalimony']

  // Fall back to build-time env var
  const brandId = (process.env.NEXT_PUBLIC_BRAND || 'noalimony') as keyof typeof brands
  return brands[brandId] || brands['noalimony']
}
