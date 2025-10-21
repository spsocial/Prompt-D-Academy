import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prompt D Academy - เรียนรู้ AI แบบมืออาชีพ',
  description: 'แพลตฟอร์มเรียนรู้ AI ออนไลน์สำหรับผู้ที่ต้องการพัฒนาทักษะด้วย AI Tools ชั้นนำ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
