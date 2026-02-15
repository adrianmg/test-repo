export interface TreeItem {
  label: string
  kind: 'file' | 'folder'
  indent: number
}

export const fileTreeItems: TreeItem[] = [
  { label: 'src', kind: 'folder', indent: 0 },
  { label: 'components', kind: 'folder', indent: 1 },
  { label: 'Icons.tsx', kind: 'file', indent: 2 },
  { label: 'hooks', kind: 'folder', indent: 1 },
  { label: 'useSidebarState.ts', kind: 'file', indent: 2 },
  { label: 'usePlatform.ts', kind: 'file', indent: 2 },
  { label: 'App.tsx', kind: 'file', indent: 1 },
  { label: 'index.css', kind: 'file', indent: 1 },
  { label: 'main.tsx', kind: 'file', indent: 1 },
  { label: 'package.json', kind: 'file', indent: 0 },
  { label: 'tsconfig.json', kind: 'file', indent: 0 },
  { label: 'vite.config.ts', kind: 'file', indent: 0 },
]
