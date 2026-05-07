'use client' // needs window event listeners

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function KeyboardShortcuts() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Don't fire inside input/textarea/select
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key.toLowerCase()) {
        case 'r':
          // R → start recording (only from home)
          if (pathname === '/') {
            const btn = document.querySelector<HTMLButtonElement>('button[data-shortcut="record"]')
            btn?.click()
          }
          break
        case 'l':
          router.push('/library')
          break
        case 'h':
          router.push('/')
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [pathname, router])

  return null
}
