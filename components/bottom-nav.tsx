'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BarChart2, BookOpen, Home, Library } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/library', label: 'Bibliothek', icon: Library },
  { href: '/frameworks', label: 'Frameworks', icon: BookOpen },
  { href: '/trends', label: 'Fortschritt', icon: BarChart2 },
]

export function BottomNav() {
  const pathname = usePathname()

  // Hide on record page — full-screen immersive
  if (pathname.startsWith('/record')) return null

  return (
    <nav className="bg-background/80 border-border fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-sm md:hidden">
      <div className="flex items-center">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
