export function WelcomeSection({ taskStats, viewCopy }) {
  return (
    <section className="welcome-section">
      <div>
        <p className="eyebrow">{viewCopy.eyebrow}</p>
        <h1>{viewCopy.title}</h1>
        <p className="welcome-copy">{viewCopy.description}</p>
      </div>

      <div className="today-progress">
        <div
          className="progress-ring"
          style={{ '--progress-angle': `${taskStats.progress * 3.6}deg` }}
        >
          <div>
            <strong>{taskStats.completedToday}</strong>
            <span>/{taskStats.today}</span>
          </div>
        </div>
        <div>
          <span>Today's progress</span>
          <strong>
            {taskStats.progress === 100 && taskStats.today
              ? 'All done - lovely.'
              : `${taskStats.today - taskStats.completedToday} left to complete`}
          </strong>
        </div>
      </div>
    </section>
  )
}
