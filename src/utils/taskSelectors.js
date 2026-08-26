import { getGreeting } from './date.js'

/** Derive dashboard numbers from tasks instead of storing duplicate state. */
export function getTaskStats(tasks, todayKey) {
  const todayTasks = tasks.filter((task) => task.dueDate === todayKey)
  const completedToday = todayTasks.filter((task) => task.completed).length
  const active = tasks.filter((task) => !task.completed).length

  return {
    active,
    completed: tasks.length - active,
    today: todayTasks.length,
    completedToday,
    progress: todayTasks.length
      ? Math.round((completedToday / todayTasks.length) * 100)
      : 0,
  }
}

/** Apply all active view filters in one predictable pipeline. */
export function getVisibleTasks(
  tasks,
  { activeView, searchQuery, selectedProject, todayKey },
) {
  const normalizedSearch = searchQuery.trim().toLowerCase()

  return tasks
    .filter((task) => {
      if (selectedProject && task.project !== selectedProject) return false
      if (activeView === 'today') return task.dueDate <= todayKey
      if (activeView === 'upcoming') return task.dueDate > todayKey && !task.completed
      if (activeView === 'completed') return task.completed
      return true
    })
    .filter(
      (task) =>
        !normalizedSearch ||
        `${task.title} ${task.project}`.toLowerCase().includes(normalizedSearch),
    )
    .sort((firstTask, secondTask) => {
      if (firstTask.completed !== secondTask.completed) {
        return Number(firstTask.completed) - Number(secondTask.completed)
      }
      if (firstTask.dueDate !== secondTask.dueDate) {
        return firstTask.dueDate.localeCompare(secondTask.dueDate)
      }
      return firstTask.createdAt - secondTask.createdAt
    })
}

export function getViewCopy(activeView, selectedProject, now = new Date()) {
  if (selectedProject) {
    return {
      eyebrow: 'Project',
      title: selectedProject,
      description: `Everything moving forward in ${selectedProject.toLowerCase()}.`,
    }
  }

  return {
    today: {
      eyebrow: getGreeting(now),
      title: 'Make today count.',
      description: 'A clear list makes room for your best work.',
    },
    all: {
      eyebrow: 'Your workspace',
      title: 'All tasks',
      description: 'Every commitment, together in one calm place.',
    },
    upcoming: {
      eyebrow: 'Plan ahead',
      title: 'Upcoming',
      description: 'A look at what is waiting around the corner.',
    },
    completed: {
      eyebrow: 'Well done',
      title: 'Completed',
      description: 'A little proof of all the progress you have made.',
    },
  }[activeView]
}

export function getEmptyState(activeView, searchQuery) {
  if (searchQuery) {
    return {
      title: 'No matching tasks',
      description: 'Try another word or clear your search.',
    }
  }
  if (activeView === 'completed') {
    return {
      title: 'Nothing completed yet',
      description: 'Finish a task and your wins will collect here.',
    }
  }
  if (activeView === 'upcoming') {
    return {
      title: 'The horizon is clear',
      description: 'Add a task with a future date when you are ready.',
    }
  }
  return {
    title: 'A beautifully clear list',
    description: 'Add a task above and give your day some direction.',
  }
}
