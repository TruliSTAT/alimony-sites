import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getBrandServer } from '@/lib/getBrandServer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlausibleAnalytics from '@/components/PlausibleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandServer()
  return {
    title: {
      default: brand.defaultTitle,
      template: `%s | ${brand.siteName}`,
    },
    description: brand.defaultDescription,
    openGraph: {
      siteName: brand.siteName,
      images: [{ url: brand.ogImage }],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const brand = await getBrandServer()
  return (
    <html lang="en">
      <head>
        <PlausibleAnalytics domain={brand.domain} />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
