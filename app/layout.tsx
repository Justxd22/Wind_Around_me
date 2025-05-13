import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wind Around Me',
  description: 'Predict Wind speed using simplified Navier-Stokes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
