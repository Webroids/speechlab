import type { Metadata } from 'next'
import { Geist as FontSans, Instrument_Serif as FontDisplay, JetBrains_Mono as FontMono } from 'next/font/google'

import { META_THEME_COLORS } from '@/constants/config'
import { siteConfig } from '@/constants/site'

import { AppProvider } from '@/components/providers'
import { BottomNav } from '@/components/bottom-nav'
import { SideNav } from '@/components/side-nav'
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts'

import { cn } from '@/lib/utils'

import '../styles/globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fontDisplay = FontDisplay({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: '400',
  variable: '--font-display',
})

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.name,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
        <meta
          name="theme-color"
          content={META_THEME_COLORS.light}
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn('bg-background font-sans antialiased', fontSans.variable, fontDisplay.variable, fontMono.variable)}
      >
        <AppProvider>
          <KeyboardShortcuts />
          <div className="flex min-h-screen">
            <SideNav />
            <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden pb-16 md:pb-0">
              {children}
            </div>
          </div>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  )
}
