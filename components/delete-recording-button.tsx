'use client'

import { useState, useTransition } from 'react'

import { Trash2 } from 'lucide-react'

import { deleteRecording } from '@/actions/delete-recording'

export function DeleteRecordingButton({ recordingId }: { recordingId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">Wirklich löschen?</span>
        <button
          onClick={() => {
            startTransition(() => deleteRecording(recordingId))
          }}
          disabled={pending}
          className="rounded-md bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/25 disabled:opacity-50 dark:text-red-400"
        >
          {pending ? 'Löscht…' : 'Ja, löschen'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="text-muted-foreground text-xs underline"
        >
          Abbrechen
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-muted-foreground hover:text-destructive flex items-center gap-1.5 text-xs transition-colors"
      aria-label="Aufnahme löschen"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Löschen
    </button>
  )
}
