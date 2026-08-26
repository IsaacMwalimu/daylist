import { formatLongDate } from '../utils/date.js'
import { Icon } from './Icon.jsx'

export function Topbar({ date, onClearSearch, onSearchChange, searchQuery }) {
  return (
    <header className="topbar">
      <p className="current-date">{formatLongDate(date)}</p>
      <label className="search-box">
        <span className="sr-only">Search tasks</span>
        <Icon name="search" size={18} />
        <input
          id="task-search"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks"
          type="search"
          value={searchQuery}
        />
        {searchQuery && (
          <button
            aria-label="Clear search"
            className="clear-search"
            onClick={onClearSearch}
            type="button"
          >
            <Icon name="x" size={16} />
          </button>
        )}
        <kbd>/</kbd>
      </label>
    </header>
  )
}
