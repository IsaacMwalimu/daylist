import {
  ArrowRight,
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  ListTodo,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkle,
  Sun,
  Trash2,
  X,
} from 'lucide-react'

/**
 * Semantic aliases keep icon choices centralized while Lucide's named imports
 * allow the production build to include only the icons Daylist actually uses.
 */
const ICONS = {
  arrowRight: ArrowRight,
  calendar: Calendar,
  calendarDays: CalendarDays,
  check: Check,
  chevronDown: ChevronDown,
  circleCheck: CircleCheck,
  listTodo: ListTodo,
  pencil: Pencil,
  plus: Plus,
  search: Search,
  slidersHorizontal: SlidersHorizontal,
  sparkle: Sparkle,
  sun: Sun,
  trash2: Trash2,
  x: X,
}

export function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const LucideIcon = ICONS[name]
  if (!LucideIcon) return null

  return (
    <LucideIcon
      aria-hidden="true"
      className="icon"
      size={size}
      strokeWidth={strokeWidth}
    />
  )
}
