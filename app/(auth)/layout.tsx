import { redirect } from 'next/navigation'

import { getUser } from '@/lib/supabase/session'

export default async function AuthPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()
  if (user) redirect('/home')

  return <>{children}</>
}
