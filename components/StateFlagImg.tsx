'use client'

interface StateFlagImgProps {
  src: string
  alt: string
  className?: string
}

export default function StateFlagImg({ src, alt, className }: StateFlagImgProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  )
}
