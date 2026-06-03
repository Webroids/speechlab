'use server'

import { redirect } from 'next/navigation'

import { createSessionClient } from '@/lib/supabase/session'
import { loginSchema } from '@/lib/schemas/auth'

export async function sendMagicLinkAction(formData: FormData) {
  const email = (formData.get('email') as string | null)?.trim()

  if (!email || !email.includes('@')) {
    return { error: 'Gültige E-Mail-Adresse eingeben.' }
  }

  const supabase = await createSessionClient()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm`,
      shouldCreateUser: true,
    },
  })

  if (error) {
    console.error('Supabase magic link error:', JSON.stringify(error))
    return { error: error.message }
  }

  return { success: true }
}

export async function authWithPasswordAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const mode = formData.get('mode') as 'login' | 'register'
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createSessionClient()

  if (mode === 'login') {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: 'E-Mail oder Passwort falsch.' }
    redirect('/')
  } else {
    const confirmPassword = formData.get('confirmPassword') as string
    if (password !== confirmPassword) {
      return { error: 'Passwörter stimmen nicht überein.' }
    }
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }
    return { success: true }
  }
}

export async function signInWithOAuthAction(provider: 'google' | 'apple') {
  const supabase = await createSessionClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${siteUrl}/auth/confirm` },
  })

  if (error || !data.url) {
    return { error: error?.message ?? 'OAuth-Fehler' }
  }

  redirect(data.url)
}

export async function signOutAction() {
  const supabase = await createSessionClient()
  await supabase.auth.signOut()
  redirect('/login')
}
