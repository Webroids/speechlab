import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/session'
import { LandingContent } from './landing-content'

export const metadata = {
  title: 'SpeechLab — Sprich klarer. Wirke schärfer.',
  description:
    'Personal communication training. Aufnahme → Transkription → KI-Feedback. Für deutschsprachige Nutzer.',
}

export default async function LandingPage() {
  const user = await getUser().catch(() => null)
  if (user) redirect('/home')
  return <LandingContent />
}
