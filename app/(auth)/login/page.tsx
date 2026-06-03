'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useActionState, useState, useTransition } from 'react'
import { Loader2, Mail } from 'lucide-react'

import { authWithPasswordAction, signInWithOAuthAction } from '@/app/actions/auth'

type State = { error?: string; success?: boolean } | null

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}


export default function LoginPage() {
  const searchParams = useSearchParams()
  const linkError = searchParams.get('error')
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [oauthError, setOauthError] = useState<string | null>(null)
  const [isPendingOAuth, startOAuthTransition] = useTransition()

  const [state, action, isPending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      return await authWithPasswordAction(_prev, formData)
    },
    null,
  )

  const isLogin = tab === 'login'

  function handleOAuth(provider: 'google' | 'apple') {
    setOauthError(null)
    startOAuthTransition(async () => {
      const result = await signInWithOAuthAction(provider)
      if (result && 'error' in result) {
        setOauthError(result.error ?? 'OAuth-Fehler')
      }
    })
  }

  return (
    <div className="flex min-h-[100dvh]">

      {/* ── Left gradient panel ─────────────────────────────── */}
      <div
        className="hidden md:flex md:w-[42%] lg:w-[45%] flex-col justify-between p-10 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, var(--vl-coral) 0%, var(--vl-amber) 55%, oklch(0.82 0.12 85) 100%)',
        }}
      >
        {/* Noise overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <Image
            src="/icon.png"
            alt="SpeechLab"
            width={36}
            height={36}
            className="rounded-xl"
          />
          <span
            className="label-caps"
            style={{ fontSize: '0.7rem', letterSpacing: '0.18em', color: 'oklch(0.967 0.012 75)' }}
          >
            SPEECHLAB
          </span>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <p
            className="mb-3 text-sm font-medium"
            style={{ color: 'oklch(0.967 0.012 75 / 70%)' }}
          >
            Deine Stimme. Dein Fortschritt.
          </p>
          <p
            className="font-display"
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'oklch(0.967 0.012 75)',
            }}
          >
            Werde besser darin,<br />
            <em>wie du sprichst.</em>
          </p>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div
        className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-16"
        style={{ background: 'var(--background)' }}
      >
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-10 md:hidden">
          <Image src="/icon.png" alt="SpeechLab" width={28} height={28} className="rounded-lg" />
          <span className="label-caps" style={{ fontSize: '0.7rem', letterSpacing: '0.18em' }}>SPEECHLAB</span>
        </div>

        {state?.success ? (
          /* ── Register success state ── */
          <div className="w-full max-w-sm text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: 'var(--vl-coral-bg)' }}
            >
              <Mail className="h-7 w-7" style={{ color: 'var(--vl-coral)' }} strokeWidth={1.75} />
            </div>
            <h2
              className="font-display mb-2"
              style={{ fontSize: '1.625rem', letterSpacing: '-0.025em' }}
            >
              Fast fertig.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)', maxWidth: '32ch', margin: '0 auto' }}>
              Prüfe dein Postfach und bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 text-xs font-medium transition-opacity hover:opacity-60"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Zurück zum Login
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm">

            {/* Heading */}
            <div className="mb-8">
              <div
                className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: 'var(--vl-coral-bg)' }}
              >
                <span style={{ color: 'var(--vl-coral)', fontSize: '1.25rem', lineHeight: 1 }}>✦</span>
              </div>
              <h1
                className="font-display mb-2"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}
              >
                {isLogin ? (
                  <>Willkommen<br /><em style={{ color: 'var(--muted-foreground)' }}>zurück.</em></>
                ) : (
                  <>Konto<br /><em style={{ color: 'var(--muted-foreground)' }}>erstellen.</em></>
                )}
              </h1>
            </div>

            {/* Tabs */}
            <div
              className="mb-6 flex rounded-xl p-1"
              style={{ background: 'var(--secondary)', border: '1px solid var(--vl-hairline)' }}
            >
              {(['login', 'register'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className="flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-150"
                  style={tab === t ? {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    boxShadow: '0 1px 3px oklch(0.14 0.015 55 / 12%)',
                  } : {
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {t === 'login' ? 'Anmelden' : 'Registrieren'}
                </button>
              ))}
            </div>

            {/* OAuth buttons */}
            <div className="space-y-2.5 mb-5">
              <button
                type="button"
                disabled={isPendingOAuth}
                onClick={() => handleOAuth('google')}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-medium transition-all duration-150 hover:opacity-80 active:scale-[0.98] disabled:opacity-40"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--vl-hairline)',
                  color: 'var(--foreground)',
                }}
              >
                {isPendingOAuth ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Mit Google {isLogin ? 'anmelden' : 'registrieren'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid var(--vl-hairline)' }} />
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-3 text-xs"
                  style={{ background: 'var(--background)', color: 'var(--muted-foreground)' }}
                >
                  oder per E-Mail
                </span>
              </div>
            </div>

            {/* Email/password form */}
            <form action={action} className="space-y-3">
              <input type="hidden" name="mode" value={tab} />

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
                  className="w-full rounded-xl px-4 py-3.5 text-sm outline-none placeholder:opacity-40 transition-shadow duration-150"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--vl-hairline)',
                    color: 'var(--foreground)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2.5px var(--vl-coral)')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                />
              </div>

              <div>
                <label className="label-caps mb-2.5 block" htmlFor="password">
                  Passwort
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3.5 text-sm outline-none placeholder:opacity-40 transition-shadow duration-150"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--vl-hairline)',
                    color: 'var(--foreground)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2.5px var(--vl-coral)')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="label-caps mb-2.5 block" htmlFor="confirmPassword">
                    Passwort bestätigen
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3.5 text-sm outline-none placeholder:opacity-40 transition-shadow duration-150"
                    style={{
                      background: 'var(--card)',
                      border: '1px solid var(--vl-hairline)',
                      color: 'var(--foreground)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2.5px var(--vl-coral)')}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                </div>
              )}

              {(state?.error || linkError || oauthError) && (
                <p className="text-xs font-medium" style={{ color: 'var(--vl-coral)' }}>
                  {state?.error ?? oauthError ?? (linkError === 'invalid_link'
                    ? 'Ungültiger oder abgelaufener Link. Bitte erneut anmelden.'
                    : 'Ein Fehler ist aufgetreten.')}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
                style={{ background: 'var(--foreground)', color: 'var(--background)' }}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {isLogin ? 'Anmelden' : 'Konto erstellen'}
              </button>
            </form>

            {/* Switch tab hint */}
            <p className="mt-6 text-center text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {isLogin ? (
                <>Noch kein Konto?{' '}
                  <button
                    onClick={() => setTab('register')}
                    className="font-semibold transition-opacity hover:opacity-70"
                    style={{ color: 'var(--vl-coral)' }}
                  >
                    Registrieren
                  </button>
                </>
              ) : (
                <>Bereits registriert?{' '}
                  <button
                    onClick={() => setTab('login')}
                    className="font-semibold transition-opacity hover:opacity-70"
                    style={{ color: 'var(--vl-coral)' }}
                  >
                    Anmelden
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
