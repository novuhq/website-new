export function getDirectoryTimeAgo(date: string, now = new Date()): string {
  const updatedAt = new Date(date)
  const diffTime = Math.abs(now.getTime() - updatedAt.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "today"
  }

  if (diffDays === 1) {
    return "yesterday"
  }

  if (diffDays > 365) {
    return "more than a year ago"
  }

  return `${diffDays} days ago`
}
