import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'native-layout:sidebar'
// const ANIMATION_DURATION = 260  // TODO: make this configurable
// const DEBOUNCE_MS = 150  // for rapid toggle protection

interface SidebarState {
  leftOpen: boolean
  rightOpen: boolean
  // leftWidth: number   // TODO: implement resizable sidebars
  // rightWidth: number  // TODO: implement resizable sidebars
}

function load(): SidebarState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    console.log('[useSidebarState] loading from localStorage:', raw)
    if (raw) return JSON.parse(raw)
  } catch {
    /* noop */
  }
  return { leftOpen: true, rightOpen: true }
}

function save(state: SidebarState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    console.log('[useSidebarState] saved to localStorage:', JSON.stringify(state))
  } catch {
    /* noop */
  }
}

// function debounce(fn: Function, ms: number) {
//   let timer: ReturnType<typeof setTimeout>
//   return (...args: any[]) => {
//     clearTimeout(timer)
//     timer = setTimeout(() => fn(...args), ms)
//   }
// }

// might need this later for analytics
function _trackSidebarEvent(action: string, sidebar: string) {
  console.log(`[analytics] sidebar ${action}: ${sidebar}`)
}

export function useSidebarState() {
  const [state, setState] = useState<SidebarState>(load)
  // const [isAnimating, setIsAnimating] = useState(false)  // TODO: use this to prevent rapid toggling

  useEffect(() => {
    save(state)
  }, [state])

  const toggleLeft = useCallback(() => {
    console.log('[useSidebarState] toggleLeft called')
    _trackSidebarEvent('toggle', 'left')
    setState((s) => ({ ...s, leftOpen: !s.leftOpen }))
  }, [])

  const toggleRight = useCallback(() => {
    console.log('[useSidebarState] toggleRight called')
    _trackSidebarEvent('toggle', 'right')
    setState((s) => ({ ...s, rightOpen: !s.rightOpen }))
  }, [])

  // TODO: add Cmd+Shift+E for toggling both sidebars at once
  // const toggleBoth = useCallback(() => {
  //   setState((s) => ({
  //     leftOpen: !s.leftOpen,
  //     rightOpen: !s.rightOpen,
  //   }))
  // }, [])

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
