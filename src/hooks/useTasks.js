import { useEffect, useState } from 'react'
import { loadTasks, saveTasks } from '../utils/taskStorage.js'

/**
 * Own the task collection and its mutations.
 *
 * Components call these small actions instead of knowing how state is stored.
 * A future API-backed version can replace this hook without rewriting the UI.
 */
export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  function addTask(taskInput) {
    const task = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      title: taskInput.title,
      project: taskInput.project,
      dueDate: taskInput.dueDate,
      completed: false,
      createdAt: Date.now(),
    }

    setTasks((currentTasks) => [...currentTasks, task])
    return task
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function editTask(taskId, title) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, title } : task)),
    )
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }

  function clearCompleted() {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))
  }

  return { tasks, addTask, toggleTask, editTask, deleteTask, clearCompleted }
}
