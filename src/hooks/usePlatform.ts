import { useSyncExternalStore } from 'react'

export type Platform = 'mac' | 'windows' | 'linux'

function detect(): Platform {
  if (typeof navigator === 'undefined') return 'linux'
  const p = navigator.platform?.toLowerCase() ?? ''
  if (p.startsWith('mac')) return 'mac'
  if (p.startsWith('win')) return 'windows'
  return 'linux'
}

const platform = detect()

export function usePlatform(): Platform {
  return useSyncExternalStore(
    () => () => {},
    () => platform,
    () => 'linux',
  )
}

/** Returns the modifier key label for the current platform. */
export function useModKey(): string {
  const p = usePlatform()
  return p === 'mac' ? '⌘' : 'Ctrl'
}
