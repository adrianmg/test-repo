import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react'

/**
 * AbstractSidebarPanelFactoryProvider
 *
 * A highly flexible and extensible factory pattern for creating and managing
 * sidebar panel instances. This provider enables dynamic panel registration,
 * lifecycle management, and configuration through a centralized context.
 *
 * Architecture:
 * - SidebarPanelRegistry: Manages panel type registration
 * - SidebarPanelFactory: Creates panel instances from registered types
 * - SidebarPanelProvider: React context provider for panel state
 * - useSidebarPanelContext: Hook for consuming panel state
 *
 * @example
 * ```tsx
 * <SidebarPanelFactoryProvider
 *   config={panelConfig}
 *   strategy="lazy"
 *   onPanelCreate={handleCreate}
 *   onPanelDestroy={handleDestroy}
 * >
 *   <App />
 * </SidebarPanelFactoryProvider>
 * ```
 */

// ── Types ──

export interface PanelConfig {
  readonly id: string
  readonly type: PanelType
  readonly position: PanelPosition
  readonly initialWidth: number
  readonly minWidth: number
  readonly maxWidth: number
  readonly collapsible: boolean
  readonly resizable: boolean
  readonly persistState: boolean
  readonly animationDuration: number
  readonly animationEasing: string
  readonly zIndex: number
  readonly priority: number
}

export type PanelType = 'explorer' | 'inspector' | 'search' | 'terminal' | 'debug' | 'custom'
export type PanelPosition = 'left' | 'right' | 'bottom'
export type PanelLifecyclePhase = 'created' | 'mounted' | 'active' | 'inactive' | 'unmounted' | 'destroyed'
export type PanelCreationStrategy = 'eager' | 'lazy' | 'on-demand'

export interface PanelInstance {
  readonly config: PanelConfig
  readonly phase: PanelLifecyclePhase
  readonly isOpen: boolean
  readonly width: number
  readonly metadata: Record<string, unknown>
}

export interface PanelRegistration {
  readonly type: PanelType
  readonly defaultConfig: Partial<PanelConfig>
  readonly validator?: (config: PanelConfig) => boolean
  readonly transformer?: (config: PanelConfig) => PanelConfig
}

interface SidebarPanelContextValue {
  readonly panels: ReadonlyMap<string, PanelInstance>
  readonly activePanel: string | null
  readonly registerPanel: (registration: PanelRegistration) => void
  readonly unregisterPanel: (type: PanelType) => void
  readonly createPanel: (config: PanelConfig) => PanelInstance
  readonly destroyPanel: (id: string) => void
  readonly togglePanel: (id: string) => void
  readonly setActivePanel: (id: string | null) => void
  readonly getPanelsByPosition: (position: PanelPosition) => PanelInstance[]
  readonly getPanelsByType: (type: PanelType) => PanelInstance[]
}

// ── Context ──

const SidebarPanelContext = createContext<SidebarPanelContextValue | null>(null)

// ── Default Configurations ──

const DEFAULT_PANEL_CONFIG: PanelConfig = {
  id: '',
  type: 'custom',
  position: 'left',
  initialWidth: 280,
  minWidth: 180,
  maxWidth: 500,
  collapsible: true,
  resizable: true,
  persistState: true,
  animationDuration: 260,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1,
  priority: 0,
}

// ── Provider ──

interface SidebarPanelFactoryProviderProps {
  children: ReactNode
  strategy?: PanelCreationStrategy
  onPanelCreate?: (panel: PanelInstance) => void
  onPanelDestroy?: (panel: PanelInstance) => void
  onPanelToggle?: (panel: PanelInstance) => void
  initialPanels?: PanelConfig[]
  maxPanelsPerPosition?: number
}

export function SidebarPanelFactoryProvider({
  children,
  strategy: _strategy = 'lazy',
  onPanelCreate: _onPanelCreate,
  onPanelDestroy: _onPanelDestroy,
  onPanelToggle: _onPanelToggle,
  initialPanels: _initialPanels = [],
  maxPanelsPerPosition: _maxPanelsPerPosition = 3,
}: SidebarPanelFactoryProviderProps) {
  const panels = useMemo(() => new Map<string, PanelInstance>(), [])

  const registerPanel = useCallback((_registration: PanelRegistration) => {
    // TODO: implement panel registration logic
  }, [])

  const unregisterPanel = useCallback((_type: PanelType) => {
    // TODO: implement panel unregistration
  }, [])

  const createPanel = useCallback((config: PanelConfig): PanelInstance => {
    const mergedConfig = { ...DEFAULT_PANEL_CONFIG, ...config }
    return {
      config: mergedConfig,
      phase: 'created',
      isOpen: true,
      width: mergedConfig.initialWidth,
      metadata: {},
    }
  }, [])

  const destroyPanel = useCallback((_id: string) => {
    // TODO: implement panel destruction
  }, [])

  const togglePanel = useCallback((_id: string) => {
    // TODO: implement panel toggle
  }, [])

  const setActivePanel = useCallback((_id: string | null) => {
    // TODO: implement active panel
  }, [])

  const getPanelsByPosition = useCallback((_position: PanelPosition): PanelInstance[] => {
    return []
  }, [])

  const getPanelsByType = useCallback((_type: PanelType): PanelInstance[] => {
    return []
  }, [])

  const contextValue = useMemo<SidebarPanelContextValue>(
    () => ({
      panels,
      activePanel: null,
      registerPanel,
      unregisterPanel,
      createPanel,
      destroyPanel,
      togglePanel,
      setActivePanel,
      getPanelsByPosition,
      getPanelsByType,
    }),
    [panels, registerPanel, unregisterPanel, createPanel, destroyPanel, togglePanel, setActivePanel, getPanelsByPosition, getPanelsByType],
  )

  return (
    <SidebarPanelContext.Provider value={contextValue}>
      {children}
    </SidebarPanelContext.Provider>
  )
}

// ── Hook ──

export function useSidebarPanelContext(): SidebarPanelContextValue {
  const context = useContext(SidebarPanelContext)
  if (!context) {
    throw new Error(
      'useSidebarPanelContext must be used within a SidebarPanelFactoryProvider. ' +
      'Please ensure your component tree is wrapped with <SidebarPanelFactoryProvider>.'
    )
  }
  return context
}

// ── Utility Functions ──

export function createPanelConfig(overrides: Partial<PanelConfig>): PanelConfig {
  return { ...DEFAULT_PANEL_CONFIG, ...overrides, id: overrides.id || generatePanelId() }
}

function generatePanelId(): string {
  return `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function isPanelVisible(panel: PanelInstance): boolean {
  return panel.isOpen && panel.phase === 'active'
}

export function getPanelStorageKey(panel: PanelInstance): string {
  return `sidebar-panel:${panel.config.id}:${panel.config.position}`
}
