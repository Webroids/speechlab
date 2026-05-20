import { NextRequest, NextResponse } from 'next/server'

import { processRecording } from '@/actions/process-recording'

export const maxDuration = 300

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  await processRecording(id)
  return NextResponse.json({ ok: true })
}
