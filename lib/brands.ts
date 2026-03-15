// ============================================================
// brands.ts — Dual-brand configuration system
// Switch between noalimony.com and knowalimony.com via env var
// ============================================================

export type BrandId = 'noalimony' | 'knowalimony'

export interface BrandConfig {
  id: BrandId
  domain: string
  siteName: string
  tagline: string
  subTagline: string
  description: string

  // Emotional tone
  tone: 'defensive' | 'empowering'
  perspective: 'payor' | 'recipient'

  // Copy
  heroHeadline: string
  heroSubheadline: string
  heroCTA: string
  heroSecondaryCTA: string
  calculatorHeadline: string
  attorneyWidgetIntro: string
  noAttorneyMessage: string

  // Colors (Tailwind class names)
  colors: {
    primary: string
    secondary: string
    accent: string
    dark: string
    light: string
    text: string
    primaryHex: string
    secondaryHex: string
    accentHex: string
    darkHex: string
    lightHex: string
  }

  // SEO
  defaultTitle: string
  defaultDescription: string
  ogImage: string

  // Legal
  siteLabel: string
}

const noAlimonyBrand: BrandConfig = {
  id: 'noalimony',
  domain: 'noalimony.com',
  siteName: 'NoAlimony.com',
  tagline: "Protect What You've Earned",
  subTagline: 'Strategic legal defense against alimony obligations',
  description: 'Connect with experienced attorneys who fight to minimize or eliminate alimony payments.',

  tone: 'defensive',
  perspective: 'payor',

  heroHeadline: 'Stop Paying More Than You Should',
  heroSubheadline: 'Alimony doesn\'t have to be forever. Connect with a strategic attorney in your area who specializes in minimizing and eliminating spousal support obligations.',
  heroCTA: 'Find Your Attorney',
  heroSecondaryCTA: 'Calculate Your Exposure',
  calculatorHeadline: 'Estimate Your Alimony Obligation',
  attorneyWidgetIntro: 'A local attorney in your area specializes in reducing alimony payments:',
  noAttorneyMessage: 'Find a qualified attorney in your area who can help reduce or eliminate your alimony obligation.',

  colors: {
    primary: 'blue-800',
    secondary: 'emerald-600',
    accent: 'sky-500',
    dark: 'slate-900',
    light: 'blue-50',
    text: 'slate-800',
    primaryHex: '#1e40af',
    secondaryHex: '#059669',
    accentHex: '#0ea5e9',
    darkHex: '#0f172a',
    lightHex: '#eff6ff',
  },

  defaultTitle: 'NoAlimony.com — Stop Paying More Than You Should',
  defaultDescription: 'Strategic legal resources for those seeking to minimize or eliminate alimony payments. Connect with experienced attorneys near you.',
  ogImage: '/images/og-noalimony.png',

  siteLabel: 'NoAlimony.com',
}

const knowAlimonyBrand: BrandConfig = {
  id: 'knowalimony',
  domain: 'knowalimony.com',
  siteName: 'KnowAlimony.com',
  tagline: 'Know Your Rights. Secure Your Future.',
  subTagline: 'Empowering alimony recipients with knowledge and legal advocacy',
  description: 'Connect with experienced attorneys who fight to secure the alimony support you deserve.',

  tone: 'empowering',
  perspective: 'recipient',

  heroHeadline: 'You Deserve Fair Financial Support',
  heroSubheadline: 'Don\'t let your financial future be decided without a fight. Connect with a dedicated attorney who will advocate for the alimony support you\'ve earned and deserve.',
  heroCTA: 'Find Your Advocate',
  heroSecondaryCTA: 'Know Your Rights',
  calculatorHeadline: 'Estimate Your Alimony Entitlement',
  attorneyWidgetIntro: 'A local advocate in your area specializes in securing fair alimony awards:',
  noAttorneyMessage: 'Find a qualified advocate in your area who can help you secure the alimony support you deserve.',

  colors: {
    primary: 'violet-700',
    secondary: 'amber-600',
    accent: 'purple-500',
    dark: 'indigo-950',
    light: 'violet-50',
    text: 'indigo-950',
    primaryHex: '#7c3aed',
    secondaryHex: '#d97706',
    accentHex: '#a855f7',
    darkHex: '#1e1b4b',
    lightHex: '#faf5ff',
  },

  defaultTitle: 'KnowAlimony.com — Know Your Rights. Secure Your Future.',
  defaultDescription: 'Empowering alimony recipients with knowledge, legal resources, and connections to experienced advocates near you.',
  ogImage: '/images/og-knowalimony.png',

  siteLabel: 'KnowAlimony.com',
}

export const brands: Record<BrandId, BrandConfig> = {
  noalimony: noAlimonyBrand,
  knowalimony: knowAlimonyBrand,
}

export function getBrand(): BrandConfig {
  const brandId = (process.env.NEXT_PUBLIC_BRAND || 'noalimony') as BrandId
  return brands[brandId] || noAlimonyBrand
}

export default getBrand
