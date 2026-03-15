import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getBrand } from '@/lib/brands'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

const brand = getBrand()

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
