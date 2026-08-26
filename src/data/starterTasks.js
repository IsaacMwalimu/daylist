import { addDays, toDateKey } from '../utils/date.js'

/**
 * Create relative sample dates so the learning demo always feels current.
 * These tasks are used only when the browser has never saved a Daylist before.
 */
export function createStarterTasks(now = new Date()) {
  const today = toDateKey(now)
  const tomorrow = toDateKey(addDays(now, 1))
  const later = toDateKey(addDays(now, 3))
  const createdAt = Date.now()

  return [
    {
      id: 'starter-plan',
      title: "Plan the week's top three priorities",
      project: 'Work',
      dueDate: today,
      completed: false,
      createdAt: createdAt - 4000,
    },
    {
      id: 'starter-walk',
      title: 'Take a 20-minute walk outside',
      project: 'Wellness',
      dueDate: today,
      completed: true,
      createdAt: createdAt - 3000,
    },
    {
      id: 'starter-call',
      title: 'Call the design team with feedback',
      project: 'Work',
      dueDate: today,
      completed: false,
      createdAt: createdAt - 2000,
    },
    {
      id: 'starter-groceries',
      title: 'Pick up groceries for dinner',
      project: 'Personal',
      dueDate: tomorrow,
      completed: false,
      createdAt: createdAt - 1000,
    },
    {
      id: 'starter-checkup',
      title: 'Book the annual health checkup',
      project: 'Wellness',
      dueDate: later,
      completed: false,
      createdAt,
    },
  ]
}
