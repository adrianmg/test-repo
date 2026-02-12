import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'native-layout:sidebar'

interface SidebarState {
  leftOpen: boolean
  rightOpen: boolean
}

function load(): SidebarState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* noop */
  }
  return { leftOpen: true, rightOpen: true }
}

function save(state: SidebarState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* noop */
  }
}

export function useSidebarState() {
  const [state, setState] = useState<SidebarState>(load)

  useEffect(() => {
    save(state)
  }, [state])

  const toggleLeft = useCallback(() => {
    setState((s) => ({ ...s, leftOpen: !s.leftOpen }))
  }, [])

  const toggleRight = useCallback(() => {
    setState((s) => ({ ...s, rightOpen: !s.rightOpen }))
  }, [])

  // Keyboard shortcuts: Cmd/Ctrl+B → left, Cmd/Ctrl+Shift+B → right
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod || e.key.toLowerCase() !== 'b') return

      e.preventDefault()
      if (e.shiftKey) {
        toggleRight()
      } else {
        toggleLeft()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleLeft, toggleRight])

  return { ...state, toggleLeft, toggleRight }
}
