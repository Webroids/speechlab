export function formatDistanceToNow(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 6) {
    return date.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
  }
  if (days > 0) return `vor ${days} Tag${days > 1 ? 'en' : ''}`
  if (hours > 0) return `vor ${hours} Std.`
  if (minutes > 0) return `vor ${minutes} Min.`
  return 'gerade eben'
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  if (s === 0) return `${m} min`
  return `${m} min ${s}s`
}
