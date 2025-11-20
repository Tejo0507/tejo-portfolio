const defaultFormatter = new Intl.DateTimeFormat("en", {
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
})

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

export function formatTimestamp(dateIso: string) {
  const date = new Date(dateIso)
  return defaultFormatter.format(date)
}

export function formatRelative(dateIso: string) {
  const date = new Date(dateIso)
  const diff = Date.now() - date.getTime()
  const minutes = Math.round(diff / 60000)
  if (Math.abs(minutes) < 60) return relativeFormatter.format(-minutes, "minute")
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return relativeFormatter.format(-hours, "hour")
  const days = Math.round(hours / 24)
  return relativeFormatter.format(-days, "day")
}

export interface WorldClockEntry {
  city: string
  timezone: string
  time: string
}

export function getWorldTimes(entries: { city: string; timezone: string }[]) {
  return entries.map((entry) => {
    const formatter = new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: entry.timezone,
    })
    return {
      city: entry.city,
      timezone: entry.timezone,
      time: formatter.format(new Date()),
    }
  }) satisfies WorldClockEntry[]
}

export function formatClock(date = new Date()) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}
