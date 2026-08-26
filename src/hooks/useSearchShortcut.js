import { useEffect } from 'react'

/** Focus the search field when the user presses `/` outside another form field. */
export function useSearchShortcut(inputId) {
  useEffect(() => {
    function focusSearch(event) {
      const activeTag = document.activeElement?.tagName
      const userIsTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)

      if (event.key === '/' && !userIsTyping) {
        event.preventDefault()
        document.getElementById(inputId)?.focus()
      }
    }

    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [inputId])
}
