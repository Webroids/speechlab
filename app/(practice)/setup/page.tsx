import { FRAMEWORKS } from '@/lib/frameworks'
import { SetupClient } from './setup-client'

interface Props {
  searchParams: Promise<{ category?: string; framework?: string; topic?: string }>
}

export default async function SetupPage({ searchParams }: Props) {
  const { category, framework, topic } = await searchParams

  return (
    <SetupClient
      initialCategory={category ?? 'all'}
      initialFramework={framework ?? ''}
      initialTopicText={topic ?? ''}
      frameworks={FRAMEWORKS}
    />
  )
}
