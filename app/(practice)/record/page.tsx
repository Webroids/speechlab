import { Suspense } from 'react'

import { RecordingClient } from './recording-client'

export default function RecordPage() {
  return (
    // Dark surface -- always dark regardless of user theme preference
    <main
      className="dark flex min-h-screen flex-col"
      style={{ background: 'oklch(0.102 0.008 55)', color: 'oklch(0.967 0.012 75)' }}
    >
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-8">
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center">
              <p className="animate-pulse" style={{ color: 'oklch(0.560 0.018 60)' }}>Lade…</p>
            </div>
          }
        >
          <RecordingClient />
        </Suspense>
      </div>
    </main>
  )
}
