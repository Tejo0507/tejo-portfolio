import { lazy, Suspense, useMemo, useState, type ComponentType } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useOSStore, OS_APPS, type OSAppId, type WindowState } from "@/store/osStore"
import { snapPosition } from "@/utils/dragUtils"
import { WindowWrapper } from "./WindowWrapper"
import { Taskbar } from "./Taskbar"

const FileExplorerApp = lazy(() => import("@/os/apps/FileExplorer"))
const NotesApp = lazy(() => import("@/os/apps/NotesApp"))
const TerminalApp = lazy(() => import("@/os/apps/Terminal"))
const ThemeSwitcherApp = lazy(() => import("@/os/apps/ThemeSwitcher"))
const EasterEggApp = lazy(() => import("@/os/apps/EasterEgg"))

const appComponentMap: Record<OSAppId, ComponentType> = {
  "file-explorer": FileExplorerApp,
  notes: NotesApp,
  terminal: TerminalApp,
  theme: ThemeSwitcherApp,
  "easter-egg": EasterEggApp,
}

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  appId: OSAppId | null
}

const initialIconPositions = OS_APPS.reduce<Record<OSAppId, { x: number; y: number }>>((acc, app, index) => {
  if (!app.showOnDesktop) return acc
  const column = Math.floor(index / 6)
  const row = index % 6
  acc[app.id] = { x: 80 + column * 120, y: 100 + row * 100 }
  return acc
}, {} as Record<OSAppId, { x: number; y: number }>)

export function Desktop() {
  const prefersReducedMotion = useReducedMotion()
  const windows = useOSStore((state) => state.windows)
  const theme = useOSStore((state) => state.theme)
  const launchApp = useOSStore((state) => state.launchApp)
  const setActiveWindow = useOSStore((state) => state.setActiveWindow)
  const [iconPositions, setIconPositions] = useState(initialIconPositions)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, appId: null })
  const wallpaperClass =
    theme === "dark"
      ? "bg-[radial-gradient(circle_at_top,_rgba(94,75,67,0.25),_transparent_55%)]"
      : "bg-[radial-gradient(circle_at_top,_rgba(94,75,67,0.4),_transparent_60%)]"

  const desktopApps = useMemo(() => OS_APPS.filter((app) => app.showOnDesktop), [])

  const handleDesktopContext = (event: React.MouseEvent) => {
    event.preventDefault()
    setContextMenu({ visible: false, x: event.clientX, y: event.clientY, appId: null })
  }

  const handleIconContext = (event: React.MouseEvent, appId: OSAppId) => {
    event.preventDefault()
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY, appId })
  }

  const handleContextAction = (action: "open" | "properties" | "delete") => {
    if (!contextMenu.appId) return
    if (action === "open") {
      launchApp(contextMenu.appId)
    }
    if (action === "properties") {
      alert(`Coming soon: Properties for ${contextMenu.appId}`)
    }
    if (action === "delete") {
      // purely cosmetic deletion, restore on refresh
      setIconPositions((positions) => {
        const next = { ...positions }
        delete next[contextMenu.appId as OSAppId]
        return next
      })
    }
    setContextMenu({ visible: false, x: 0, y: 0, appId: null })
  }

  return (
    <div
      className={`relative flex min-h-screen flex-col bg-[#2E1F1B] text-[#F7E6D4]`}
      onContextMenu={handleDesktopContext}
    >
      <div className={`flex-1 overflow-hidden ${wallpaperClass}`}>
        <div className="relative h-full w-full">
          {desktopApps.map((app) => {
            const Icon = app.icon
            const position = iconPositions[app.id] ?? { x: 80, y: 120 }
            return (
              <motion.button
                key={app.id}
                drag
                dragMomentum={false}
                dragElastic={prefersReducedMotion ? 0 : 0.1}
                onDragEnd={(_, info) => {
                  const target = snapPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y })
                  setIconPositions((prev) => ({ ...prev, [app.id]: target }))
                }}
                onClick={() => launchApp(app.id)}
                onContextMenu={(event) => handleIconContext(event, app.id)}
                className="absolute flex w-28 flex-col items-center gap-2 rounded-2xl border border-transparent bg-transparent p-4 text-center text-sm text-[#F7E6D4]/80 outline-none transition hover:border-[#5E4B43]/40"
                style={{ left: position.x, top: position.y }}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1C120E]/80 text-[#F7E6D4] shadow-lg shadow-[#000]/30">
                  <Icon className="h-6 w-6" />
                </span>
                <span>{app.title}</span>
              </motion.button>
            )
          })}

          <AnimatePresence>
            {contextMenu.visible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute z-50 w-48 rounded-2xl border border-[#5E4B43]/40 bg-[#1B110D] p-2 text-sm shadow-2xl"
                style={{ left: contextMenu.x, top: contextMenu.y }}
              >
                {["open", "delete", "properties"].map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => handleContextAction(action as "open" | "delete" | "properties")}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left uppercase tracking-[0.2em] text-[#F7E6D4]/80 hover:bg-[#5E4B43]/20"
                  >
                    {action}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {windows
            .filter((win) => !win.minimized)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((win) => (
              <WindowWrapper key={win.id} window={win}>
                <Suspense fallback={<div className="p-6 text-sm text-[#F7E6D4]/70">Loading {win.title}…</div>}>
                  <AppRenderer window={win} />
                </Suspense>
              </WindowWrapper>
            ))}
        </div>
      </div>

      <Taskbar windows={windows} onLaunch={launchApp} onFocus={setActiveWindow} />
    </div>
  )
}

function AppRenderer({ window }: { window: WindowState }) {
  const Component = appComponentMap[window.appId]
  return Component ? <Component /> : <div className="p-4 text-sm text-[#F7E6D4]">App unavailable.</div>
}
