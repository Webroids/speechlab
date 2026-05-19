import { redirect } from 'next/navigation'

import { getUser } from '@/lib/supabase/session'
import { AccountClient } from './account-client'

export default async function AccountPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <AccountClient
      email={user.email ?? ''}
      displayName={(user.user_metadata?.full_name as string | undefined) ?? ''}
    />
  )
}
