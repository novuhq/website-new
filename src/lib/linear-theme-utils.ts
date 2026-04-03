export interface MessageWithDate {
  isRead: boolean
  dateInMin?: number
  date: string
}

function parseDateToMinutes(date: string): number {
  const match = date.match(/(\d+)\s*(min|h|d)/)
  if (!match) return 0

  const value = parseInt(match[1], 10)
  const unit = match[2]

  switch (unit) {
    case "min":
      return value
    case "h":
      return value * 60
    case "d":
      return value * 60 * 24
    default:
      return 0
  }
}

function prepareMessages<T extends MessageWithDate>(messages: T[]): T[] {
  return messages.map((message) => ({
    ...message,
    dateInMin: parseDateToMinutes(message.date),
  }))
}

function filterMessages<T extends MessageWithDate>(
  messages: T[],
  showRead: boolean
): T[] {
  if (showRead) return messages
  return messages.filter((message) => !message.isRead)
}

function sortMessages<T extends MessageWithDate>(
  messages: T[],
  showUnreadFirst: boolean,
  isNewest: boolean
): T[] {
  return [...messages].sort((a, b) => {
    if (showUnreadFirst) {
      if (!a.isRead && b.isRead) return -1
      if (a.isRead && !b.isRead) return 1
    }
    const aMin = a.dateInMin ?? 0
    const bMin = b.dateInMin ?? 0
    return isNewest ? aMin - bMin : bMin - aMin
  })
}

export function prepareAndFilterMessages<T extends MessageWithDate>(
  messages: T[],
  showRead: boolean,
  showUnreadFirst: boolean,
  isNewest: boolean
): T[] {
  const prepared = prepareMessages(messages)
  const filtered = filterMessages(prepared, showRead)
  return sortMessages(filtered, showUnreadFirst, isNewest)
}
