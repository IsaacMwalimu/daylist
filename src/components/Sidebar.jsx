import { NAV_ITEMS, PROJECTS } from '../config/taskConfig.js'
import { Icon } from './Icon.jsx'

function getNavigationCount(viewId, tasks, taskStats, todayKey) {
  if (viewId === 'today') return taskStats.today
  if (viewId === 'completed') return taskStats.completed
  if (viewId === 'all') return tasks.length
  return tasks.filter((task) => task.dueDate > todayKey && !task.completed).length
}

/** Desktop navigation; CSS turns its task views into scrollable chips on mobile. */
export function Sidebar({
  activeView,
  onSelectProject,
  onSelectView,
  selectedProject,
  taskStats,
  tasks,
  todayKey,
}) {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-mark" aria-hidden="true">
          <span />
        </div>
        <span className="brand-name">Daylist</span>
      </div>

      <nav className="primary-nav" aria-label="Task views">
        <p className="nav-label">My tasks</p>
        <div className="nav-list">
          {NAV_ITEMS.map((item) => (
            <button
              className={`nav-item ${activeView === item.id && !selectedProject ? 'active' : ''}`}
              key={item.id}
              onClick={() => onSelectView(item.id)}
              type="button"
            >
              <span className="nav-item-main">
                <Icon name={item.icon} size={19} />
                {item.label}
              </span>
              <span className="nav-count">
                {getNavigationCount(item.id, tasks, taskStats, todayKey)}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <div className="projects-section">
        <div className="section-label-row">
          <p className="nav-label">Projects</p>
          <span>{PROJECTS.length}</span>
        </div>
        <div className="project-list">
          {PROJECTS.map((project) => (
            <button
              className={`project-item ${selectedProject === project.name ? 'active' : ''}`}
              key={project.name}
              onClick={() => onSelectProject(project.name)}
              type="button"
            >
              <span
                className="project-dot"
                style={{ '--project-color': project.color }}
              />
              <span>{project.name}</span>
              <span className="project-count">
                {
                  tasks.filter(
                    (task) => task.project === project.name && !task.completed,
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="focus-card">
        <div className="focus-card-top">
          <span className="focus-icon">
            <Icon name="sparkle" size={17} />
          </span>
          <span>{taskStats.progress}%</span>
        </div>
        <h2>Daily focus</h2>
        <p>
          {taskStats.today
            ? `${taskStats.completedToday} of ${taskStats.today} tasks finished today.`
            : 'Add your first task for today.'}
        </p>
        <div
          className="progress-track"
          aria-label={`${taskStats.progress}% of today's tasks complete`}
        >
          <span style={{ width: `${taskStats.progress}%` }} />
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="avatar">Y</div>
        <div>
          <strong>Your workspace</strong>
          <span>{taskStats.active} open tasks</span>
        </div>
      </div>
    </aside>
  )
}
