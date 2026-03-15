import type { Metadata } from 'next'
import { getBrand } from '@/lib/brands'
import LoginClient from './LoginClient'

const brand = getBrand()

export const metadata: Metadata = {
  title: `Attorney Login — ${brand.siteName}`,
}

export default function LoginPage() {
  return <LoginClient />
}
