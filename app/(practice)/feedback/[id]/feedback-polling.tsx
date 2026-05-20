'use client' // needs polling interval + router.refresh()

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Loader2 } from 'lucide-react'

import { getRecordingStatus } from '@/actions/process-recording'
import { Button } from '@/components/ui/button'

const STATUS_LABELS: Record<string, string> = {
  recorded: 'Aufnahme gespeichert…',
  transcribing: 'Transkribiere…',
  analyzing: 'Analysiere…',
  done: 'Fertig!',
  error: 'Fehler bei der Verarbeitung',
}

interface Props {
  recordingId: string
  initialStatus: string
  topic: string
}

export function FeedbackPolling({ recordingId, initialStatus, topic }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 180_000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (status === 'done' || status === 'error') {
      router.refresh()
      return
    }

    const id = setInterval(async () => {
      try {
        const result = await getRecordingStatus(recordingId)
        if (result) {
          setStatus(result.status)
          if (result.status === 'done' || result.status === 'error') {
            clearInterval(id)
            router.refresh()
          }
        }
      } catch {
        // silent — will retry
      }
    }, 2000)

    return () => clearInterval(id)
  }, [recordingId, status, router])

  const label = STATUS_LABELS[status] ?? 'Verarbeite…'
  const isError = status === 'error'

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="text-muted-foreground max-w-xs text-sm font-medium">{topic}</div>

      {isError ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-destructive text-lg font-semibold">{label}</div>
          <p className="text-muted-foreground max-w-xs text-sm">
            Transkription oder Analyse ist fehlgeschlagen. Die Aufnahme ist gespeichert — du kannst sie in der Bibliothek anhören.
          </p>
          <div className="flex gap-3">
            <Link href="/library">
              <Button variant="outline">Zur Bibliothek</Button>
            </Link>
            <Link href="/">
              <Button>Neue Aufnahme</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <Loader2 className="text-primary h-12 w-12 animate-spin" />
          <p className="animate-pulse text-lg font-semibold">{label}</p>
          <p className="text-muted-foreground text-sm">
            {timedOut
              ? 'Dauert länger als erwartet — bitte noch kurz warten oder Bibliothek prüfen.'
              : 'Dauert 15–30 Sekunden…'}
          </p>
        </>
      )}
    </div>
  )
}
