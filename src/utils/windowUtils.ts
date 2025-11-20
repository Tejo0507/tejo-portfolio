import type { WindowState } from "@/store/osStore"
import { cascadePosition, clampPosition, getViewportRect } from "./dragUtils"

export function getNextZIndex(windows: WindowState[]): number {
  return (windows.reduce((max, win) => Math.max(max, win.zIndex), 0) || 0) + 1
}

export function bringWindowToFront(windows: WindowState[], windowId: string): WindowState[] {
  const nextZ = getNextZIndex(windows)
  return windows.map((win) => (win.id === windowId ? { ...win, zIndex: nextZ } : win))
}

export function findActiveWindow(windows: WindowState[], activeId: string | null): WindowState | null {
  if (!activeId) return null
  return windows.find((win) => win.id === activeId) ?? null
}

export function createWindowState(params: {
  appId: WindowState["appId"]
  title: string
  windows: WindowState[]
  size?: { width: number; height: number }
}): WindowState {
  const viewport = getViewportRect()
  const baseSize = params.size ?? { width: Math.min(640, viewport.width - 120), height: Math.min(420, viewport.height - 160) }
  const nextIndex = params.windows.length
  const basePosition = cascadePosition(nextIndex)
  const position = clampPosition(basePosition, baseSize, viewport)
  return {
    id: `${params.appId}-${Date.now()}`,
    appId: params.appId,
    title: params.title,
    position,
    size: baseSize,
    minimized: false,
    maximized: false,
    zIndex: getNextZIndex(params.windows),
  }
}
