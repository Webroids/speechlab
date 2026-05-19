import { redirect } from 'next/navigation'

import { getUser } from '@/lib/supabase/session'

export async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return <>{children}</>
}
