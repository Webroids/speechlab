'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useState } from 'react'
import { ArrowLeft, Check, LogOut } from 'lucide-react'

import { updateDisplayName } from '@/app/actions/account'
import { signOutAction } from '@/app/actions/auth'

type SaveState = { error?: string; success?: boolean } | null

export function AccountClient({
  email,
  displayName,
}: {
  email: string
  displayName: string
}) {
  const router = useRouter()
  const [name, setName] = useState(displayName)
  const [signingOut, setSigningOut] = useState(false)

  const [state, action, isPending] = useActionState<SaveState, FormData>(
    async (_prev, _formData) => {
      return await updateDisplayName(name)
    },
    null,
  )

  const initial = (displayName || email || '?')[0].toUpperCase()

  async function handleSignOut() {
    setSigningOut(true)
    await signOutAction()
  }

  return (
    <div className="mx-auto w-full max-w-lg px-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 pt-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/5 active:scale-95 dark:hover:bg-white/10"
          style={{ color: 'var(--muted-foreground)', border: '1px solid var(--vl-hairline)' }}
          aria-label="Zurück"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="label-caps mb-0.5">KONTO</p>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            Dein <em style={{ color: 'var(--muted-foreground)' }}>Profil.</em>
          </h1>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Avatar + email */}
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-2xl"
            style={{
              background: 'var(--vl-coral-bg)',
              color: 'var(--vl-coral)',
              fontStyle: 'italic',
            }}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium" style={{ letterSpacing: '-0.01em' }}>
              {displayName || email}
            </p>
            <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {email}
            </p>
          </div>
        </div>

        {/* Display name form */}
        <form action={action} className="space-y-3">
          <div>
            <label className="label-caps mb-2.5 block" htmlFor="displayName">
              Anzeigename
            </label>
            <input
              id="displayName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-40 transition-shadow duration-150"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--vl-hairline)',
                color: 'var(--foreground)',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--vl-coral)')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          {state?.error && (
            <p className="text-xs font-medium" style={{ color: 'var(--vl-coral)' }}>
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || name.trim() === displayName}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            {state?.success ? (
              <><Check className="h-4 w-4" /> Gespeichert</>
            ) : isPending ? (
              'Wird gespeichert…'
            ) : (
              'Speichern'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--vl-hairline)' }} />

        {/* Sign out */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-150 hover:opacity-80 active:scale-[0.98] disabled:opacity-40"
            style={{
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--vl-hairline)',
            }}
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? 'Wird abgemeldet…' : 'Abmelden'}
          </button>
          <p className="text-center text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Konto wechseln: abmelden und mit anderer E-Mail anmelden.
          </p>
        </div>
      </div>
    </div>
  )
}
