import { useState } from 'react'
import { Sidebar } from './components/Sidebar.jsx'
import { TaskComposer } from './components/TaskComposer.jsx'
import { TaskList } from './components/TaskList.jsx'
import { Topbar } from './components/Topbar.jsx'
import { WelcomeSection } from './components/WelcomeSection.jsx'
import { DEFAULT_PROJECT } from './config/taskConfig.js'
import { useSearchShortcut } from './hooks/useSearchShortcut.js'
import { useTasks } from './hooks/useTasks.js'
import { addDays, toDateKey } from './utils/date.js'
import {
  getEmptyState,
  getTaskStats,
  getViewCopy,
  getVisibleTasks,
} from './utils/taskSelectors.js'
import './styles/app.css'

/**
 * App is the page coordinator.
 *
 * It owns state shared by several sections, while task persistence and rendering
 * details live in focused hooks, utilities, and components.
 */
function App() {
  const now = new Date()
  const todayKey = toDateKey(now)
  const { tasks, addTask, toggleTask, editTask, deleteTask, clearCompleted } =
    useTasks()

  const [activeView, setActiveView] = useState('today')
  const [selectedProject, setSelectedProject] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskProject, setNewTaskProject] = useState(DEFAULT_PROJECT)
  const [newTaskDate, setNewTaskDate] = useState(todayKey)

  useSearchShortcut('task-search')

  // These values are derived from `tasks`; keeping them out of state prevents drift.
  const taskStats = getTaskStats(tasks, todayKey)
  const visibleTasks = getVisibleTasks(tasks, {
    activeView,
    searchQuery,
    selectedProject,
    todayKey,
  })
  const viewCopy = getViewCopy(activeView, selectedProject, now)
  const emptyState = getEmptyState(activeView, searchQuery)

  function selectView(view) {
    setActiveView(view)
    setSelectedProject('')

    // Give the composer a useful default date for the destination view.
    if (view === 'today') setNewTaskDate(todayKey)
    if (view === 'upcoming' && newTaskDate <= todayKey) {
      setNewTaskDate(toDateKey(addDays(now, 1)))
    }
  }

  function selectProject(projectName) {
    setSelectedProject(projectName)
    setActiveView('all')
    setNewTaskProject(projectName)
  }

  function handleAddTask(taskInput) {
    const task = addTask(taskInput)
    setNewTaskTitle('')
    setSearchQuery('')

    // If a filter would hide the new task, move to the matching date view so the
    // user's action always has immediate, visible feedback.
    const visibleInCurrentView = selectedProject
      ? task.project === selectedProject
      : activeView === 'all' ||
        (activeView === 'today' && task.dueDate <= todayKey) ||
        (activeView === 'upcoming' && task.dueDate > todayKey)

    if (!visibleInCurrentView) {
      setSelectedProject('')
      setActiveView(task.dueDate > todayKey ? 'upcoming' : 'today')
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        onSelectProject={selectProject}
        onSelectView={selectView}
        selectedProject={selectedProject}
        taskStats={taskStats}
        tasks={tasks}
        todayKey={todayKey}
      />

      <main className="main-content">
        <Topbar
          date={now}
          onClearSearch={() => setSearchQuery('')}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />

        <WelcomeSection taskStats={taskStats} viewCopy={viewCopy} />

        <TaskComposer
          dueDate={newTaskDate}
          onAdd={handleAddTask}
          onDueDateChange={setNewTaskDate}
          onProjectChange={setNewTaskProject}
          onTitleChange={setNewTaskTitle}
          project={newTaskProject}
          title={newTaskTitle}
          todayKey={todayKey}
        />

        <TaskList
          activeView={activeView}
          completedCount={taskStats.completed}
          emptyState={emptyState}
          onClearCompleted={clearCompleted}
          onClearSearch={() => setSearchQuery('')}
          onDelete={deleteTask}
          onEdit={editTask}
          onToggle={toggleTask}
          searchQuery={searchQuery}
          selectedProject={selectedProject}
          tasks={visibleTasks}
          todayKey={todayKey}
        />
      </main>
    </div>
  )
}

export default App
