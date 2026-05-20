'use client'

import { useState, useTransition } from 'react'

import { Trash2 } from 'lucide-react'

import { deleteRecording } from '@/actions/delete-recording'

export function DeleteRecordingButton({ recordingId, compact = false }: { recordingId: string; compact?: boolean }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  if (confirming) {
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
        <span className="text-muted-foreground text-xs">Löschen?</span>
        <button
          onClick={(e) => {
            e.preventDefault()
            startTransition(() => deleteRecording(recordingId))
          }}
          disabled={pending}
          className="rounded-md bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/25 disabled:opacity-50 dark:text-red-400"
        >
          {pending ? '…' : 'Ja'}
        </button>
        <button
          onClick={(e) => { e.preventDefault(); setConfirming(false) }}
          disabled={pending}
          className="text-muted-foreground text-xs underline"
        >
          Nein
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); setConfirming(true) }}
      className="text-muted-foreground hover:text-destructive flex items-center gap-1.5 text-xs transition-colors"
      aria-label="Aufnahme löschen"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {!compact && 'Löschen'}
    </button>
  )
}
