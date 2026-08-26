import { STORAGE_KEY } from '../config/taskConfig.js'
import { createStarterTasks } from '../data/starterTasks.js'

/** Validate persisted data before it reaches the UI. */
function isTask(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.project === 'string' &&
    typeof value.dueDate === 'string' &&
    typeof value.completed === 'boolean' &&
    typeof value.createdAt === 'number'
  )
}

export function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY)

    // `null` means this is a first visit. An empty saved array is intentional.
    if (savedTasks === null) return createStarterTasks()

    const parsedTasks = JSON.parse(savedTasks)
    if (!Array.isArray(parsedTasks)) return createStarterTasks()
    return parsedTasks.filter(isTask)
  } catch {
    // Corrupt or blocked storage should never prevent the app from rendering.
    return createStarterTasks()
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // The current session remains usable when private browsing blocks storage.
  }
}
