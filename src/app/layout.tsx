import type { Metadata } from 'next'
import { inter, notoSansJP, sourceCodePro } from '@/app/fonts'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ja' className={`${inter.variable} ${notoSansJP.variable} ${sourceCodePro.variable}`}>
      <body className='text-stone-800 relative'>
        {children}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Naoto Kaneko',
  description: 'Naoto Kanekoのホームページです',
  authors: [{ name: 'Naoto Kaneko', url: 'https://naoty.dev' }],
  generator: 'Next.js',
  metadataBase: new URL('https://naoty.dev'),
  alternates: {
    types: {
      'application/rss+xml': '/posts/feed.xml',
    },
  },
  twitter: {
    card: 'summary',
  },
}
