import { Toggle } from '@base-ui/react/toggle'
import { Tooltip } from '@base-ui/react/tooltip'
import { useSidebarState } from './hooks/useSidebarState'
import { usePlatform, useModKey } from './hooks/usePlatform'
import {
  PanelLeftIcon,
  PanelRightIcon,
  FileIcon,
  FolderIcon,
  SearchIcon,
  SettingsIcon,
  InfoIcon,
  LayersIcon,
} from './components/Icons'

const SIDEBAR_WIDTH = 280
const MACOS_TRAFFIC_LIGHT_WIDTH = 72

function App() {
  const { leftOpen: isLeftSidebarOpen, rightOpen: isRightSidebarOpen, toggleLeft: handleToggleLeftSidebar, toggleRight: handleToggleRightSidebar } = useSidebarState()
  const currentPlatform = usePlatform()
  const modifierKey = useModKey()
  const isRunningOnMacOS = currentPlatform === 'mac'

  /* Width the left sidebar-header contributes (excluding traffic-light spacer). */
  const calculatedLeftHeaderWidth = isLeftSidebarOpen ? SIDEBAR_WIDTH - (isRunningOnMacOS ? MACOS_TRAFFIC_LIGHT_WIDTH : 0) : 0

  return (
    <div className="flex h-full flex-col">
      {/* ───── Titlebar ───── */}
      <header className="titlebar-drag flex h-[38px] shrink-0 items-center border-b border-border bg-surface-titlebar">
        {/* macOS traffic-light spacer — always present, keeps toggle clear */}
        {isRunningOnMacOS && <div className="w-[72px] shrink-0" />}

        {/* Left sidebar header section */}
        <div
          className="sidebar-transition flex h-full shrink-0 items-center overflow-hidden"
          style={{ width: calculatedLeftHeaderWidth }}
        >
          <div
            className="sidebar-transition flex h-full items-center gap-2 px-4"
            style={{
              width: SIDEBAR_WIDTH - (isRunningOnMacOS ? MACOS_TRAFFIC_LIGHT_WIDTH : 0),
              opacity: isLeftSidebarOpen ? 1 : 0,
            }}
          >
            <FolderIcon className="size-4 text-text-secondary" />
            <span className="truncate text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Explorer
            </span>
          </div>
        </div>

        {/* Main titlebar area — toggles live here */}
        <div className="flex h-full min-w-0 flex-1 items-center justify-between gap-1 px-1">
          <SidebarToggleButton
            isPressed={isLeftSidebarOpen}
            onToggle={handleToggleLeftSidebar}
            tooltipText={`Toggle sidebar (${modifierKey}+B)`}
            panelSide="left"
          >
            <PanelLeftIcon />
          </SidebarToggleButton>

          <span className="pointer-events-none truncate text-xs text-text-muted">
            Desktop App
          </span>

          <SidebarToggleButton
            isPressed={isRightSidebarOpen}
            onToggle={handleToggleRightSidebar}
            tooltipText={`Toggle sidebar (${modifierKey}+Shift+B)`}
            panelSide="right"
          >
            <PanelRightIcon />
          </SidebarToggleButton>
        </div>

        {/* Right sidebar header section */}
        <div
          className="sidebar-transition flex h-full shrink-0 items-center overflow-hidden"
          style={{ width: isRightSidebarOpen ? SIDEBAR_WIDTH : 0 }}
        >
          <div
            className="sidebar-transition flex h-full items-center gap-2 px-4"
            style={{ width: SIDEBAR_WIDTH, opacity: isRightSidebarOpen ? 1 : 0 }}
          >
            <InfoIcon className="size-4 text-text-secondary" />
            <span className="truncate text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Inspector
            </span>
          </div>
        </div>
      </header>

      {/* ───── Content ───── */}
      <div className="flex min-h-0 flex-1">
        {/* Left sidebar */}
        <aside
          className="sidebar-transition shrink-0 overflow-hidden border-r border-border bg-surface-sidebar"
          style={{ width: isLeftSidebarOpen ? SIDEBAR_WIDTH : 0 }}
        >
          <div
            className="sidebar-transition h-full"
            style={{ width: SIDEBAR_WIDTH, opacity: isLeftSidebarOpen ? 1 : 0 }}
          >
            <LeftSidebarPanelContent />
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col overflow-auto bg-surface-main">
          <MainContentArea />
        </main>

        {/* Right sidebar */}
        <aside
          className="sidebar-transition shrink-0 overflow-hidden border-l border-border bg-surface-sidebar"
          style={{ width: isRightSidebarOpen ? SIDEBAR_WIDTH : 0 }}
        >
          <div
            className="sidebar-transition h-full"
            style={{ width: SIDEBAR_WIDTH, opacity: isRightSidebarOpen ? 1 : 0 }}
          >
            <RightSidebarPanelContent />
          </div>
        </aside>
      </div>
    </div>
  )
}

/* ───── Toggle button with tooltip (Base UI) ───── */

function SidebarToggleButton({
  isPressed,
  onToggle,
  tooltipText,
  panelSide,
  children,
}: {
  isPressed: boolean
  onToggle: () => void
  tooltipText: string
  panelSide: 'left' | 'right'
  children: React.ReactNode
}) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <Toggle
              pressed={isPressed}
              onPressedChange={onToggle}
              aria-label={tooltipText}
              className="titlebar-no-drag inline-flex size-7 items-center justify-center rounded text-text-secondary transition-colors hover:bg-control-hover hover:text-text-primary focus-visible:ring-1 focus-visible:ring-accent focus-visible:outline-none data-[pressed]:text-accent"
            />
          }
        >
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side={panelSide === 'left' ? 'right' : 'left'} sideOffset={6}>
            <Tooltip.Popup className="rounded bg-surface-titlebar px-2 py-1 text-xs text-text-primary shadow-lg ring-1 ring-border">
              {tooltipText}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

/* ───── Demo sidebar content ───── */

const treeItems = [
  { label: 'src', kind: 'folder' as const, indent: 0 },
  { label: 'components', kind: 'folder' as const, indent: 1 },
  { label: 'Icons.tsx', kind: 'file' as const, indent: 2 },
  { label: 'hooks', kind: 'folder' as const, indent: 1 },
  { label: 'useSidebarState.ts', kind: 'file' as const, indent: 2 },
  { label: 'usePlatform.ts', kind: 'file' as const, indent: 2 },
  { label: 'App.tsx', kind: 'file' as const, indent: 1 },
  { label: 'index.css', kind: 'file' as const, indent: 1 },
  { label: 'main.tsx', kind: 'file' as const, indent: 1 },
  { label: 'package.json', kind: 'file' as const, indent: 0 },
  { label: 'tsconfig.json', kind: 'file' as const, indent: 0 },
  { label: 'vite.config.ts', kind: 'file' as const, indent: 0 },
]

function LeftSidebarPanelContent() {
  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <SearchIcon className="size-3.5 text-text-muted" />
        <span className="text-xs text-text-muted">Search files…</span>
      </div>

      {/* File tree */}
      <nav className="flex-1 overflow-y-auto px-1 py-1">
        {treeItems.map((item) => (
          <div
            key={item.label}
            className="flex cursor-default items-center gap-1.5 rounded px-2 py-[3px] hover:bg-control-hover"
            style={{ paddingLeft: 8 + item.indent * 16 }}
          >
            {item.kind === 'folder' ? (
              <FolderIcon className="size-3.5 text-accent" />
            ) : (
              <FileIcon className="size-3.5 text-text-secondary" />
            )}
            <span className="truncate text-xs">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Bottom bar */}
      <div className="flex items-center gap-2 border-t border-border px-3 py-2">
        <SettingsIcon className="size-3.5 text-text-muted" />
        <span className="text-xs text-text-muted">Settings</span>
      </div>
    </div>
  )
}

function RightSidebarPanelContent() {
  const properties = [
    { key: 'Name', value: 'App.tsx' },
    { key: 'Type', value: 'TypeScript React' },
    { key: 'Size', value: '4.2 KB' },
    { key: 'Lines', value: '186' },
    { key: 'Modified', value: 'Just now' },
    { key: 'Encoding', value: 'UTF-8' },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Properties
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <dl className="space-y-3">
          {properties.map((p) => (
            <div key={p.key}>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                {p.key}
              </dt>
              <dd className="mt-0.5 text-xs text-text-primary">{p.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <LayersIcon className="size-3.5 text-text-muted" />
          <span className="text-xs text-text-muted">3 layers</span>
        </div>
      </div>
    </div>
  )
}

function MainContentArea() {
  const modifierKey = useModKey()
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="mb-3 text-xl font-semibold text-text-primary">
          Native Desktop Layout
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-text-secondary">
          Three-column layout with collapsible sidebars, OS-aware titlebar, and
          keyboard shortcuts. Built with React, Tailwind CSS, and Base UI.
        </p>
        <div className="inline-flex flex-col gap-2 rounded-lg border border-border bg-surface-sidebar p-4 text-left">
          <KeyboardShortcutDisplay keys={[modifierKey, 'B']} label="Toggle left sidebar" />
          <KeyboardShortcutDisplay keys={[modifierKey, 'Shift', 'B']} label="Toggle right sidebar" />
        </div>
      </div>
    </div>
  )
}

function KeyboardShortcutDisplay({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-text-secondary">{label}</span>
      <span className="flex gap-1">
        {keys.map((k) => (
          <kbd
            key={k}
            className="inline-flex min-w-[22px] items-center justify-center rounded border border-border bg-surface-app px-1.5 py-0.5 text-[11px] font-medium text-text-primary"
          >
            {k}
          </kbd>
        ))}
      </span>
    </div>
  )
}

export default App
