import { Suspense } from 'react'

import { RecordingClient } from './recording-client'

export default function RecordPage() {
  return (
    <main className="container mx-auto flex min-h-screen max-w-xl flex-col px-4 py-8">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground animate-pulse">Lade…</p>
          </div>
        }
      >
        <RecordingClient />
      </Suspense>
    </main>
  )
}
