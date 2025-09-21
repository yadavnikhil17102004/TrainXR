import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TrainXR - Exercise Tracking System',
  description: 'AI-powered exercise tracking and form analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}