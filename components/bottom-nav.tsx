'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BarChart2, BookOpen, Home, Library, Mic2 } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Today', icon: Home },
  { href: '/library', label: 'Bibliothek', icon: Library },
  null, // centre mic slot
  { href: '/frameworks', label: 'Frameworks', icon: BookOpen },
  { href: '/trends', label: 'Fortschritt', icon: BarChart2 },
]

export function BottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith('/record') || pathname.startsWith('/setup') || pathname.startsWith('/upload') || pathname.startsWith('/account') || pathname.startsWith('/login') || pathname.startsWith('/register')) return null

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 md:hidden"
      style={{
        background: 'linear-gradient(to top, var(--background) 60%, transparent)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around px-5 pt-3 pb-4">
        {NAV_ITEMS.map((item, i) => {
          if (item === null) {
            // Centre mic button
            return (
              <Link
                key="record"
                href="/setup"
                className="flex h-14 w-14 -mt-4 items-center justify-center rounded-full transition-transform active:scale-95"
                style={{
                  background: 'var(--foreground)',
                  color: 'var(--background)',
                  boxShadow: '0 6px 20px oklch(0.140 0.015 55 / 25%)',
                }}
                aria-label="Aufnahme starten"
              >
                <Mic2 className="h-5 w-5" strokeWidth={2} />
              </Link>
            )
          }

          const { href, label, icon: Icon } = item
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors"
              style={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)' }}
            >
              <Icon
                className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
