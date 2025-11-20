import { create } from "zustand"
import { createContext, useContext } from "react"
import { clampPosition, constrainSize } from "@/utils/dragUtils"
import { bringWindowToFront, createWindowState, getNextZIndex } from "@/utils/windowUtils"
import type { LucideIcon } from "lucide-react"
import { FolderKanban, NotebookPen, TerminalSquare, SunMoon, Sparkles } from "lucide-react"

export type OSTheme = "dark" | "light"
export type OSAppId = "file-explorer" | "notes" | "terminal" | "theme" | "easter-egg"

export interface WindowState {
  id: string
  appId: OSAppId
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  minimized: boolean
  maximized: boolean
  zIndex: number
}

export interface OSAppMeta {
  id: OSAppId
  title: string
  icon: LucideIcon
  description: string
  defaultSize?: { width: number; height: number }
  showOnDesktop?: boolean
}

export const OS_APPS: OSAppMeta[] = [
  {
    id: "file-explorer",
    title: "File Explorer",
    description: "Browse projects, snippets, and study resources.",
    icon: FolderKanban,
    defaultSize: { width: 640, height: 440 },
    showOnDesktop: true,
  },
  {
    id: "notes",
    title: "Notes",
    description: "Markdown notebook with tags.",
    icon: NotebookPen,
    defaultSize: { width: 600, height: 520 },
    showOnDesktop: true,
  },
  {
    id: "terminal",
    title: "Terminal",
    description: "Mock shell with playful commands.",
    icon: TerminalSquare,
    defaultSize: { width: 520, height: 360 },
    showOnDesktop: true,
  },
  {
    id: "theme",
    title: "Theme Switcher",
    description: "Flip between dusk and dawn modes.",
    icon: SunMoon,
    defaultSize: { width: 360, height: 260 },
    showOnDesktop: false,
  },
  {
    id: "easter-egg",
    title: "Secret Garden",
    description: "A cozy surprise window.",
    icon: Sparkles,
    defaultSize: { width: 420, height: 320 },
    showOnDesktop: false,
  },
]

const appMetaMap = OS_APPS.reduce<Record<OSAppId, OSAppMeta>>((acc, app) => {
  acc[app.id] = app
  return acc
}, {} as Record<OSAppId, OSAppMeta>)

export interface OSStore {
  windows: WindowState[]
  activeWindowId: string | null
  theme: OSTheme
  launchApp: (appId: OSAppId) => void
  closeWindow: (windowId: string) => void
  minimizeWindow: (windowId: string) => void
  maximizeWindow: (windowId: string) => void
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void
  updateWindowSize: (windowId: string, size: { width: number; height: number }) => void
  setActiveWindow: (windowId: string | null) => void
  toggleTheme: () => void
  setTheme: (theme: OSTheme) => void
  cycleWindow: (direction: 1 | -1) => void
}

export const useOSStore = create<OSStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  theme: "dark",
  launchApp: (appId) => {
    const { windows } = get()
    const existing = windows.find((win) => win.appId === appId)
    if (existing) {
      set({
        windows: windows.map((win) =>
          win.id === existing.id
            ? { ...win, minimized: false, maximized: win.maximized, zIndex: getNextZIndex(windows) }
            : win
        ),
        activeWindowId: existing.id,
      })
      return
    }
    const meta = appMetaMap[appId]
    const next = createWindowState({ appId, title: meta.title, windows, size: meta.defaultSize })
    set({
      windows: [...windows, next],
      activeWindowId: next.id,
    })
  },
  closeWindow: (windowId) => {
    set((state) => ({
      windows: state.windows.filter((win) => win.id !== windowId),
      activeWindowId: state.activeWindowId === windowId ? null : state.activeWindowId,
    }))
  },
  minimizeWindow: (windowId) => {
    set((state) => ({
      windows: state.windows.map((win) => (win.id === windowId ? { ...win, minimized: true } : win)),
      activeWindowId: state.activeWindowId === windowId ? null : state.activeWindowId,
    }))
  },
  maximizeWindow: (windowId) => {
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === windowId ? { ...win, maximized: !win.maximized, minimized: false } : win
      ),
      activeWindowId: windowId,
    }))
  },
  updateWindowPosition: (windowId, position) => {
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === windowId ? { ...win, position: clampPosition(position, win.size) } : win
      ),
    }))
  },
  updateWindowSize: (windowId, size) => {
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === windowId ? { ...win, size: constrainSize(size), maximized: false } : win
      ),
    }))
  },
  setActiveWindow: (windowId) => {
    if (!windowId) {
      set({ activeWindowId: null })
      return
    }
    set((state) => ({
      windows: bringWindowToFront(state.windows, windowId),
      activeWindowId: windowId,
    }))
  },
  toggleTheme: () => {
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" }))
  },
  setTheme: (theme) => {
    set({ theme })
  },
  cycleWindow: (direction) => {
    const { windows, activeWindowId } = get()
    if (!windows.length) return
    const ordered = [...windows].sort((a, b) => a.zIndex - b.zIndex)
    const currentIndex = ordered.findIndex((win) => win.id === activeWindowId)
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + ordered.length) % ordered.length
    const nextWindow = ordered[nextIndex]
    set({
      windows: bringWindowToFront(windows, nextWindow.id),
      activeWindowId: nextWindow.id,
    })
  },
}))

const OSStoreContext = createContext<OSStore | null>(null)

export function useOSStoreFallback() {
  const ctx = useContext(OSStoreContext)
  if (!ctx) throw new Error("OS store unavailable")
  return ctx
}
