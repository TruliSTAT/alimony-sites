/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  images: {
    domains: ['via.placeholder.com'],
  },
}

module.exports = nextConfig
