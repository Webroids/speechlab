'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

import { BarChart2, BookOpen, Library, Mic2, Radio } from 'lucide-react'

import { topics } from '@/lib/topics'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Radio },
  { href: '/library', label: 'Bibliothek', icon: Library },
  { href: '/frameworks', label: 'Frameworks', icon: BookOpen },
  { href: '/trends', label: 'Fortschritt', icon: BarChart2 },
]

export function SideNav() {
  const pathname = usePathname()
  const router = useRouter()

  // Hidden on record page
  if (pathname.startsWith('/record')) return null

  function handleQuickRecord() {
    const pool = topics.filter((t) => t.difficulty !== 'hard')
    const topic = pool[Math.floor(Math.random() * pool.length)]
    const params = new URLSearchParams({ topic: topic.text, duration: '60' })
    router.push(`/record?${params.toString()}`)
  }

  return (
    <aside className="bg-card border-border hidden h-screen w-56 shrink-0 flex-col border-r md:flex sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-lg">
          <Mic2 className="text-primary-foreground h-4 w-4" />
        </div>
        <span className="text-base font-semibold tracking-tight">SpeechLab</span>
      </div>

      {/* Quick Record */}
      <div className="px-3 pb-4">
        <Button
          onClick={handleQuickRecord}
          className="w-full gap-2 font-semibold"
          size="sm"
        >
          <Mic2 className="h-4 w-4" />
          Schnell üben
        </Button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icon
                className="h-4 w-4 shrink-0"
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-4 py-3">
        <span className="text-muted-foreground text-xs">Theme</span>
        <ThemeSwitch />
      </div>
    </aside>
  )
}
