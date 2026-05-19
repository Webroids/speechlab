'use client'

import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { Loader2, Mail } from 'lucide-react'

import { sendMagicLinkAction } from '@/app/actions/auth'

type State = { error?: string; success?: boolean } | null

export default function LoginPage() {
  const searchParams = useSearchParams()
  const linkError = searchParams.get('error')

  const [state, action, isPending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      const result = await sendMagicLinkAction(formData)
      return result
    },
    null,
  )

  if (state?.success) {
    return (
      <div className="mx-auto w-full max-w-sm">
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--vl-hairline)',
            boxShadow: 'var(--vl-inset)',
          }}
        >
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: 'var(--vl-coral-bg)' }}
          >
            <Mail className="h-7 w-7" style={{ color: 'var(--vl-coral)' }} strokeWidth={1.75} />
          </div>
          <h2
            className="font-display mb-2"
            style={{ fontSize: '1.375rem', letterSpacing: '-0.02em' }}
          >
            Link gesendet.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Prüfe dein Postfach und klicke auf den Link — du wirst automatisch angemeldet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8">
        <p className="label-caps mb-2">SPEECHLAB</p>
        <h1
          className="font-display"
          style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}
        >
          Willkommen<br />
          <em style={{ color: 'var(--muted-foreground)' }}>zurück.</em>
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
          Gib deine E-Mail ein — wir schicken dir einen Login-Link.
        </p>
      </div>

      <form action={action} className="space-y-4">
        <div>
          <label className="label-caps mb-2.5 block" htmlFor="email">
            E-Mail-Adresse
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            required
            placeholder="du@beispiel.com"
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

        {(state?.error || linkError) && (
          <p className="text-xs font-medium" style={{ color: 'var(--vl-coral)' }}>
            {state?.error ?? (linkError === 'invalid_link' ? 'Ungültiger oder abgelaufener Link. Bitte erneut anmelden.' : 'Ein Fehler ist aufgetreten.')}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Wird gesendet…</>
          ) : (
            <><Mail className="h-4 w-4" /> Link senden</>
          )}
        </button>
      </form>
    </div>
  )
}
