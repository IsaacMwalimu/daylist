/** Return a new date without mutating the original date object. */
export function addDays(date, numberOfDays) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + numberOfDays)
  return nextDate
}

/**
 * Convert a Date into YYYY-MM-DD using local time.
 *
 * `toISOString()` is intentionally avoided here because UTC conversion can move
 * a task to the previous or next day for users outside the UTC timezone.
 */
export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromDateKey(dateKey) {
  return new Date(`${dateKey}T00:00:00`)
}

export function formatLongDate(date) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatDueDate(dateKey, todayKey) {
  if (dateKey === todayKey) return 'Today'

  const tomorrowKey = toDateKey(addDays(fromDateKey(todayKey), 1))
  if (dateKey === tomorrowKey) return 'Tomorrow'
  if (dateKey < todayKey) return 'Overdue'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(fromDateKey(dateKey))
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
