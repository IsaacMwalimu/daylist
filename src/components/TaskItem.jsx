import { useState } from 'react'
import { getProject } from '../config/taskConfig.js'
import { formatDueDate } from '../utils/date.js'
import { Icon } from './Icon.jsx'

/** One task row owns its temporary editing state and reports saved changes upward. */
export function TaskItem({
  isEditing,
  onBeginEdit,
  onCancelEdit,
  onDelete,
  onEdit,
  onFinishEdit,
  onToggle,
  task,
  todayKey,
}) {
  const [draftTitle, setDraftTitle] = useState(task.title)
  const project = getProject(task.project)
  const dueLabel = formatDueDate(task.dueDate, todayKey)

  function beginEditing() {
    setDraftTitle(task.title)
    onBeginEdit(task.id)
  }

  function saveEdit() {
    const normalizedTitle = draftTitle.trim()
    if (normalizedTitle && normalizedTitle !== task.title) {
      onEdit(task.id, normalizedTitle)
    }
    onFinishEdit()
  }

  function cancelEdit() {
    setDraftTitle(task.title)
    onCancelEdit()
  }

  return (
    <article className={`task-item ${task.completed ? 'completed' : ''}`}>
      <button
        aria-label={
          task.completed ? `Mark ${task.title} as active` : `Complete ${task.title}`
        }
        aria-pressed={task.completed}
        className="task-check"
        onClick={() => onToggle(task.id)}
        type="button"
      >
        {task.completed && <Icon name="check" size={16} strokeWidth={2.2} />}
      </button>

      <div className="task-body">
        {isEditing ? (
          <form
            className="edit-form"
            onSubmit={(event) => {
              event.preventDefault()
              saveEdit()
            }}
          >
            <input
              autoFocus
              onBlur={saveEdit}
              onChange={(event) => setDraftTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') cancelEdit()
              }}
              value={draftTitle}
            />
          </form>
        ) : (
          <button className="task-title" onDoubleClick={beginEditing} type="button">
            {task.title}
          </button>
        )}

        <div className="task-meta">
          <span className="project-pill">
            <span
              className="project-dot"
              style={{ '--project-color': project.color }}
            />
            {task.project}
          </span>
          <span
            className={`due-date ${dueLabel === 'Overdue' && !task.completed ? 'overdue' : ''}`}
          >
            <Icon name="calendar" size={14} />
            {dueLabel}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button aria-label={`Edit ${task.title}`} onClick={beginEditing} type="button">
          <Icon name="pencil" size={17} />
        </button>
        <button
          aria-label={`Delete ${task.title}`}
          className="delete-action"
          onClick={() => onDelete(task.id)}
          type="button"
        >
          <Icon name="trash2" size={17} />
        </button>
      </div>
    </article>
  )
}
