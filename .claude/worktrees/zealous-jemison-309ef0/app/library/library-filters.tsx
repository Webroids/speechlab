'use client' // needs URL search params manipulation

import { useRouter, useSearchParams } from 'next/navigation'

export function LibraryFilters() {
  const router = useRouter()
  const params = useSearchParams()

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value === '' || value === 'all') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    router.replace(`/library?${next.toString()}`)
  }

  const FROM_OPTIONS = [
    { label: 'Alle', value: '' },
    { label: 'Diese Woche', value: getISODate(-7) },
    { label: 'Dieser Monat', value: getISODate(-30) },
    { label: 'Dieses Jahr', value: getISODate(-365) },
  ]

  const currentFrom = params.get('from') ?? ''

  return (
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
  )
}

function getISODate(daysOffset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  return d.toISOString().slice(0, 10)
}
