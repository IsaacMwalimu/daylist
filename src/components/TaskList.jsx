import { useState } from 'react'
import { NAV_ITEMS } from '../config/taskConfig.js'
import { Icon } from './Icon.jsx'
import { TaskItem } from './TaskItem.jsx'

function getListHeading(activeView, selectedProject) {
  if (selectedProject) return `${selectedProject} tasks`
  if (activeView === 'today') return "Today's list"
  return NAV_ITEMS.find((item) => item.id === activeView)?.label
}

export function TaskList({
  activeView,
  completedCount,
  emptyState,
  onClearCompleted,
  onClearSearch,
  onDelete,
  onEdit,
  onToggle,
  searchQuery,
  selectedProject,
  tasks,
  todayKey,
}) {
  // Editing is coordinated here so only one task row can be edited at a time.
  const [editingId, setEditingId] = useState(null)

  function handleDelete(taskId) {
    onDelete(taskId)
    if (editingId === taskId) setEditingId(null)
  }

  return (
    <section className="task-section">
      <div className="task-section-header">
        <div>
          <h2>{getListHeading(activeView, selectedProject)}</h2>
          <p>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        {completedCount > 0 && (
          <button
            className="clear-completed"
            onClick={onClearCompleted}
            type="button"
          >
            Clear completed
          </button>
        )}
      </div>

      <div className="task-list" aria-live="polite">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskItem
              isEditing={editingId === task.id}
              key={task.id}
              onBeginEdit={setEditingId}
              onCancelEdit={() => setEditingId(null)}
              onDelete={handleDelete}
              onEdit={onEdit}
              onFinishEdit={() => setEditingId(null)}
              onToggle={onToggle}
              task={task}
              todayKey={todayKey}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-check">
              <Icon name="circleCheck" size={34} />
            </div>
            <h3>{emptyState.title}</h3>
            <p>{emptyState.description}</p>
            {searchQuery && (
              <button onClick={onClearSearch} type="button">
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
