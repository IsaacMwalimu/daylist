import { useState } from 'react'
import { PROJECTS } from '../config/taskConfig.js'
import { Icon } from './Icon.jsx'

/** Controlled form for creating a task; App owns values that change with views. */
export function TaskComposer({
  dueDate,
  onAdd,
  onDueDateChange,
  onProjectChange,
  onTitleChange,
  project,
  title,
  todayKey,
}) {
  const [showDetails, setShowDetails] = useState(false)
  const selectedProject = PROJECTS.find((item) => item.name === project)

  function handleSubmit(event) {
    event.preventDefault()
    const normalizedTitle = title.trim()
    if (!normalizedTitle) return
    onAdd({ title: normalizedTitle, project, dueDate: dueDate || todayKey })
  }

  return (
    <section className="composer-card" aria-label="Add a task">
      <form onSubmit={handleSubmit}>
        <div className="composer-main">
          <span className="composer-plus">
            <Icon name="plus" size={20} />
          </span>
          <label className="sr-only" htmlFor="new-task">
            New task
          </label>
          <input
            autoComplete="off"
            id="new-task"
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="What needs to be done?"
            value={title}
          />
          <button
            aria-expanded={showDetails}
            className={`details-toggle ${showDetails ? 'active' : ''}`}
            onClick={() => setShowDetails((isVisible) => !isVisible)}
            type="button"
          >
            <Icon name="slidersHorizontal" size={18} />
            <span>Details</span>
          </button>
          <button className="add-button" disabled={!title.trim()} type="submit">
            Add task
            <Icon name="arrowRight" size={17} />
          </button>
        </div>

        {showDetails && (
          <div className="composer-details">
            <label>
              <span>Project</span>
              <div className="select-wrap">
                <span
                  className="project-dot"
                  style={{ '--project-color': selectedProject?.color }}
                />
                <select
                  onChange={(event) => onProjectChange(event.target.value)}
                  value={project}
                >
                  {PROJECTS.map((projectOption) => (
                    <option key={projectOption.name}>{projectOption.name}</option>
                  ))}
                </select>
                <Icon name="chevronDown" size={16} />
              </div>
            </label>

            <label>
              <span>Due date</span>
              <div className="date-wrap">
                <Icon name="calendar" size={16} />
                <input
                  min={todayKey}
                  onChange={(event) => onDueDateChange(event.target.value)}
                  type="date"
                  value={dueDate}
                />
              </div>
            </label>
            <span className="composer-hint">Press Enter anytime to add</span>
          </div>
        )}
      </form>
    </section>
  )
}
