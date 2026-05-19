import { redirect } from 'next/navigation'

import { getUser } from '@/lib/supabase/session'

export default async function AuthPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()
  if (user) redirect('/')

  return (
    <div
      className="flex min-h-screen items-center justify-center px-5"
      style={{ background: 'var(--background)' }}
    >
      {children}
    </div>
  )
}
