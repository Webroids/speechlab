'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

import { BarChart2, BookOpen, Home, Library, Mic2, ScrollText, User } from 'lucide-react'

import { topics } from '@/lib/topics'
import { ThemeSwitch } from '@/components/theme-switch'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/home', label: 'Today', icon: Home },
  { href: '/library', label: 'Bibliothek', icon: Library },
  { href: '/topics', label: 'Themen', icon: ScrollText },
  { href: '/frameworks', label: 'Frameworks', icon: BookOpen },
  { href: '/trends', label: 'Fortschritt', icon: BarChart2 },
]

export function SideNav() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/' || pathname.startsWith('/record') || pathname.startsWith('/login') || pathname.startsWith('/register')) return null

  function handleQuickRecord() {
    const pool = topics.filter((t) => t.difficulty !== 'hard')
    const topic = pool[Math.floor(Math.random() * pool.length)]
    const params = new URLSearchParams({ topic: topic.text, duration: '60' })
    router.push(`/record?${params.toString()}`)
  }

  return (
    <aside className="bg-sidebar border-sidebar-border hidden h-screen w-56 shrink-0 flex-col border-r md:flex sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <Image
          src="/icon.png"
          alt="SpeechLab"
          width={28}
          height={28}
          className="rounded-lg shrink-0"
        />
        <span
          className="label-caps"
          style={{ fontSize: '0.7rem', letterSpacing: '0.16em', color: 'var(--foreground)' }}
        >
          SPEECHLAB
        </span>
      </div>

      {/* Quick Record */}
      <div className="px-3 pb-5">
        <button
          onClick={handleQuickRecord}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95"
          style={{
            background: 'var(--foreground)',
            color: 'var(--background)',
          }}
        >
          <Mic2 className="h-3.5 w-3.5" />
          Schnell üben
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/home' ? pathname === '/home' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-foreground/8 text-foreground'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
              )}
            >
              <Icon
                className="h-4 w-4 shrink-0"
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Account */}
      <div className="px-2 pb-1">
        <Link
          href="/account"
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
            pathname.startsWith('/account')
              ? 'bg-foreground/8 text-foreground'
              : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
          )}
        >
          <User
            className="h-4 w-4 shrink-0"
            strokeWidth={pathname.startsWith('/account') ? 2.25 : 1.75}
          />
          Konto
        </Link>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: '1px solid var(--vl-hairline)' }}
      >
        <span className="label-caps">Theme</span>
        <ThemeSwitch />
      </div>
    </aside>
  )
}
