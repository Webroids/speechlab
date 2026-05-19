'use server'

import { revalidatePath } from 'next/cache'

import { createSessionClient } from '@/lib/supabase/session'

export async function updateDisplayName(name: string) {
  const trimmed = name.trim()
  if (!trimmed || trimmed.length < 2) return { error: 'Mindestens 2 Zeichen.' }

  const supabase = await createSessionClient()
  const { error } = await supabase.auth.updateUser({
    data: { full_name: trimmed },
  })

  if (error) return { error: error.message }

  revalidatePath('/account')
  revalidatePath('/')
  return { success: true }
}
