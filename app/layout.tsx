import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/lib/context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prompt D Academy - เรียนรู้ AI แบบมืออาชีพ',
  description: 'แพลตฟอร์มเรียนรู้ AI ออนไลน์สำหรับผู้ที่ต้องการพัฒนาทักษะด้วย AI Tools ชั้นนำ',
  icons: {
    icon: '/images/logo_1.png',
    apple: '/images/logo_1.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
