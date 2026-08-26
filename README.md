# Daylist

Daylist is a focused to-do app built with React, Vite, and Lucide icons. It is small enough to learn from in one sitting, while still demonstrating useful application patterns: controlled forms, derived state, custom hooks, list filtering, inline editing, browser persistence, responsive styling, and accessible controls.

## Features

- Add tasks with a project and due date
- Browse Today, All tasks, Upcoming, and Completed views
- Filter tasks by Work, Personal, or Wellness project
- Search task titles and projects; press `/` to focus search
- Mark tasks complete, edit their titles, or delete them
- Clear all completed tasks
- Track today's completion count and progress
- Keep tasks between visits with `localStorage`
- Adapt to smaller screens, dark mode, and reduced-motion preferences

Daylist runs entirely in the browser. It does not use a backend, user accounts, or cloud synchronization.

## Getting started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm

### Install and run

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal. Open that URL in your browser.

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the project with ESLint |
| `npm run check` | Run lint and a production build together |

Before sharing a change, a useful minimum check is:

```bash
npm run check
```

## Project structure

The source is split by responsibility so task storage, task selection, page coordination, and presentation can change independently.

```text
src/
|-- components/
|   |-- Icon.jsx               # Tree-shaken Lucide icon adapter
|   |-- Sidebar.jsx            # Views, projects, counts, and focus progress
|   |-- Topbar.jsx             # Current date and task search
|   |-- WelcomeSection.jsx     # View heading and today's progress
|   |-- TaskComposer.jsx       # Controlled add-task form
|   |-- TaskItem.jsx           # One task row and its title draft
|   `-- TaskList.jsx           # List heading, empty state, and edit coordination
|-- config/
|   `-- taskConfig.js          # Storage key, projects, navigation, and defaults
|-- data/
|   `-- starterTasks.js        # First-visit sample task factory
|-- hooks/
|   |-- useTasks.js            # Task collection, actions, and persistence effect
|   `-- useSearchShortcut.js   # Keyboard shortcut for focusing search
|-- utils/
|   |-- date.js                # Local date keys, labels, and greetings
|   |-- taskSelectors.js       # Derived stats, filters, sorting, and view copy
|   `-- taskStorage.js         # localStorage validation, loading, and saving
|-- styles/
|   |-- app.css                # Component, layout, and responsive styles
|   `-- global.css             # Reset, shared tokens, and light/dark colors
|-- App.jsx                    # Page coordinator and shared UI state
`-- main.jsx                   # React entry point and global stylesheet import
```

### What each layer owns

`App.jsx` is the page coordinator. It calls `useTasks()`, owns UI state shared across sections (the current view, project, search, and composer values), calculates derived values through `taskSelectors.js`, and passes data and callbacks to components. It also makes sure a newly added task is visible by moving to a matching date view when necessary.

The components focus on presentation and short-lived interaction state:

- `Sidebar` renders navigation, project filters, counts, and daily progress.
- `Topbar` renders the formatted date and controlled search field.
- `WelcomeSection` renders view-specific copy and today's progress ring.
- `TaskComposer` validates and submits the controlled task fields. It locally owns whether its detail controls are expanded.
- `TaskList` renders list and empty states. It tracks which single task is being edited.
- `TaskItem` renders one task and locally owns the temporary title draft.
- `Icon` centralizes semantic aliases for the imported Lucide icon set.

The supporting modules keep non-visual logic out of components:

- `taskConfig.js` contains product configuration used across the app.
- `starterTasks.js` creates sample tasks with dates relative to the current day.
- `useTasks.js` owns the task array and exposes the task actions.
- `useSearchShortcut.js` installs and cleans up the `/` keyboard listener.
- `date.js` handles local calendar dates without UTC date shifts.
- `taskSelectors.js` derives counts, visible tasks, view copy, and empty-state copy.
- `taskStorage.js` validates persisted records and handles browser storage failures.
- `app.css` and `global.css` separate app-level styling from global design tokens and defaults.

## How the data flows

Each task has this shape:

```js
{
  id: 'unique-id',
  title: 'Plan the week',
  project: 'Work',
  dueDate: '2026-08-26',
  completed: false,
  createdAt: 1787712000000,
}
```

The main task flow is one-way:

```text
User submits TaskComposer or acts on a TaskItem
    |
    v
Component calls a callback supplied by App
    |
    v
useTasks action: addTask, toggleTask, editTask, deleteTask, or clearCompleted
    |
    v
setTasks creates the next task array
    |
    v
App rerenders and taskSelectors derives stats and visible tasks
    |
    v
Components receive fresh props, and useTasks saves tasks through its effect
```

Adding has one small coordinating step: `TaskComposer` calls `App`'s `handleAddTask`, which calls `useTasks.addTask` and then adjusts the selected view if the current filter would hide the new task. Toggle, edit, delete, and clear actions can be passed from `useTasks` through `App` to the list components directly.

`getTaskStats()` and `getVisibleTasks()` calculate their results from `tasks` during rendering. Counts, progress, filtered tasks, and sorted tasks are therefore derived values rather than duplicate state that could drift out of sync.

Task changes use functional updates such as `setTasks((currentTasks) => ...)`. The actions return new arrays with `map`, `filter`, or array spreading instead of mutating the current task array.

## Browser persistence

Tasks are stored as JSON under the key exported from `taskConfig.js`:

```text
daylist.tasks.v1
```

`useTasks` initializes its state with `useState(loadTasks)`, so storage is read once when the hook first runs. `loadTasks()` behaves as follows:

- With no saved value, it creates the starter tasks.
- With a saved JSON array, it keeps records that match the task shape. An intentionally empty array remains empty.
- With invalid JSON, a non-array value, or unavailable storage, it falls back to starter tasks.

After task state changes, the effect in `useTasks` calls `saveTasks(tasks)`. Storage reads and writes use `try...catch`, so the current session can still work if browser storage is unavailable.

Storage is local to the current browser and device. Clearing site data removes the saved list. To restore the starter tasks while developing, run this in the browser console and reload:

```js
localStorage.removeItem('daylist.tasks.v1')
```

## How to add a feature

Suppose you want to add task priorities (`low`, `normal`, and `high`). Follow the same module boundaries the app already uses:

1. **Define shared choices.** Add a priorities constant and default to `config/taskConfig.js` if several components need them.
2. **Extend created data.** Add `priority: 'normal'` to records in `data/starterTasks.js`, then include `taskInput.priority` in the task created by `useTasks.addTask`.
3. **Capture user input.** Add `newTaskPriority` state in `App.jsx`, pass it to `TaskComposer`, and add a controlled priority field there.
4. **Render the value.** Pass the saved property through the existing task object and render a priority label in `TaskItem`.
5. **Derive new behavior.** If priorities affect filtering or sorting, update `getVisibleTasks()` in `taskSelectors.js` instead of storing a second list.
6. **Preserve old browser data.** Existing `daylist.tasks.v1` records have no priority. In `taskStorage.js`, normalize them with a default such as `task.priority ?? 'normal'`; do not simply reject every older record.
7. **Style and verify.** Add the visual treatment to `styles/app.css`, then add, reload, edit, complete, search, filter, and delete tasks in narrow and wide layouts.

This is the general extension path: configuration, data creation, hook action, coordinator state, component UI, selector behavior, storage compatibility, and styling. Not every feature needs every layer; change only the modules that own the relevant responsibility.

## Learning notes

- `TaskComposer` is controlled: `App` is the source of truth for its title, project, and date values.
- `TaskItem` keeps only an unsaved edit draft locally; committed titles return to the central task collection through `editTask`.
- `TaskList` coordinates the active edit ID so only one task row is edited at a time.
- Functional state updates safely calculate the next task array from the previous one.
- Stable task IDs are used as React keys and as the target for edit, completion, and deletion actions.
- Semantic buttons, labels, focus styles, and live list updates should remain intact when changing visual components.

Daylist is a front-end learning project. Document new infrastructure only when it is actually added.
