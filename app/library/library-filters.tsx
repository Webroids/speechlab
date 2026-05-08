'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Search, X } from 'lucide-react'

export function LibraryFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const currentQ = params.get('q') ?? ''
  const currentFrom = params.get('from') ?? ''

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value === '' || value === 'all') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    router.replace(`/library?${next.toString()}`)
  }

  // Debounce search input
  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.value = currentQ
  }, [currentQ])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    updateParam('q', val)
  }

  const FROM_OPTIONS = [
    { label: 'Alle', value: '' },
    { label: 'Diese Woche', value: getISODate(-7) },
    { label: 'Dieser Monat', value: getISODate(-30) },
    { label: 'Dieses Jahr', value: getISODate(-365) },
  ]

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={currentQ}
          onChange={handleSearch}
          placeholder="Thema suchen…"
          className="border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border py-2 pr-8 pl-9 text-sm outline-none focus:ring-2"
        />
        {currentQ && (
          <button
            type="button"
            onClick={() => updateParam('q', '')}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            aria-label="Suche leeren"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Date filter pills */}
      <div className="flex flex-wrap gap-2">
        {FROM_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => updateParam('from', opt.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              currentFrom === opt.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input bg-background text-foreground hover:bg-accent'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function getISODate(daysOffset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  return d.toISOString().slice(0, 10)
}
