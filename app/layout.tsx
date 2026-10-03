import type { Metadata, Viewport } from 'next';
import { Noto_Serif_Thai, IBM_Plex_Sans_Thai, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import { SITE } from '@/lib/config';
import './globals.css';

const display = Noto_Serif_Thai({ subsets: ['thai', 'latin'], weight: ['500', '600', '700', '800'], variable: '--font-display-thai', display: 'swap' });
const body = IBM_Plex_Sans_Thai({ subsets: ['thai', 'latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-body-thai', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-mono-code', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ['สอน AI ฟรี', 'คอร์ส AI', 'ChatGPT', 'Claude Code', 'Nano Banana', 'Kling', 'ทำคลิปด้วย AI', 'Vibe Coding', 'Prompt'],
  openGraph: { type: 'website', locale: SITE.locale, siteName: SITE.name, url: SITE.url },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large', 'max-video-preview': -1 } },
  icons: { icon: '/icon.png' },
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0a0b0e' }, { media: '(prefers-color-scheme: light)', color: '#f4f1ea' }],
};

// ตั้งธีมก่อน paint (ค่าเริ่มต้น = มืด)
const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t?t==='dark':true)}catch(e){document.documentElement.classList.add('dark')}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`dark ${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain min-h-dvh bg-bg text-fg">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
