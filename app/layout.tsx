import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SDXL Turbo - AI Image Generator',
  description: 'Generate stunning images instantly with SDXL Turbo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
