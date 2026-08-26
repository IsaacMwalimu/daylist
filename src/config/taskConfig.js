/**
 * Shared task configuration.
 *
 * Keeping product choices here means components do not need to duplicate labels,
 * project colors, or storage identifiers.
 */
export const STORAGE_KEY = 'daylist.tasks.v1'
export const DEFAULT_PROJECT = 'Personal'

export const PROJECTS = [
  { name: 'Work', color: '#7c6cf2' },
  { name: 'Personal', color: '#ec8d5f' },
  { name: 'Wellness', color: '#4fae83' },
]

export const NAV_ITEMS = [
  { id: 'today', label: 'Today', icon: 'sun' },
  { id: 'all', label: 'All tasks', icon: 'listTodo' },
  { id: 'upcoming', label: 'Upcoming', icon: 'calendarDays' },
  { id: 'completed', label: 'Completed', icon: 'circleCheck' },
]

export function getProject(projectName) {
  return PROJECTS.find((project) => project.name === projectName) ?? PROJECTS[0]
}
