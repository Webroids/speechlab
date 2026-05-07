'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  options: { label: string; value: number }[]
  className?: string
}

export function Slider({ value, onChange, options, className }: SliderProps) {
  const idx = options.findIndex((o) => o.value === value)
  const currentIdx = idx >= 0 ? idx : 0

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <input
        type="range"
        min={0}
        max={options.length - 1}
        step={1}
        value={currentIdx}
        onChange={(e) => {
          const opt = options[parseInt(e.target.value)]
          if (opt) onChange(opt.value)
        }}
        className="accent-primary h-2 w-full cursor-pointer"
        aria-label="Aufnahme-Dauer"
      />
      <div className="flex justify-between">
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'text-xs font-medium transition-colors',
              i === currentIdx ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
