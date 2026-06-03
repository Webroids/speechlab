import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'

import { META_THEME_COLORS } from '@/constants/config'
import { siteConfig } from '@/constants/site'

import { AppProvider } from '@/components/providers'
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts'

import { cn } from '@/lib/utils'

import '../styles/globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
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
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        <AppProvider>
          <KeyboardShortcuts />
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
