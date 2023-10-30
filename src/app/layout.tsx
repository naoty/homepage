import type { Metadata } from 'next'
import { inter, notoSansJP, sourceCodePro } from '@/app/fonts'
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
    <html lang='ja' className={`${inter.variable} ${notoSansJP.variable} ${sourceCodePro.variable}`}>
      <body className='grid grid-cols-layout grid-rows-layout'>
        {children}
      </body>
    </html>
  )
}
