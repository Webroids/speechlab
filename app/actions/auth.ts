'use server'

import { redirect } from 'next/navigation'

import { createSessionClient } from '@/lib/supabase/session'

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

export async function signOutAction() {
  const supabase = await createSessionClient()
  await supabase.auth.signOut()
  redirect('/login')
}
