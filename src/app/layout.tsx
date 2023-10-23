import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Naoto Kaneko',
  description: 'Naoto Kanekoのホームページです',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ja'>
      <body className='grid grid-cols-layout grid-rows-layout'>
        {children}
      </body>
    </html>
  )
}
