import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useOSStore, OS_APPS, type OSAppId, type WindowState } from "@/store/osStore"
import { cn } from "@/utils"
import { Sun, Moon } from "lucide-react"

interface TaskbarProps {
  windows: WindowState[]
  onLaunch: (appId: OSAppId) => void
  onFocus: (windowId: string | null) => void
}

export function Taskbar({ windows, onLaunch, onFocus }: TaskbarProps) {
  const prefersReducedMotion = useReducedMotion()
  const theme = useOSStore((state) => state.theme)
  const toggleTheme = useOSStore((state) => state.toggleTheme)
  const minimizeWindow = useOSStore((state) => state.minimizeWindow)

  const orderedWindows = useMemo(() => [...windows].sort((a, b) => b.zIndex - a.zIndex), [windows])
  const dockApps = useMemo(() => OS_APPS.filter((app) => app.showOnDesktop), [])

  return (
    <motion.footer
      initial={prefersReducedMotion ? false : { y: 80, opacity: 0 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.45, 0.05, 0.25, 0.95] }}
      className="sticky bottom-4 z-50 mx-auto flex w-[95%] max-w-5xl items-center justify-between rounded-3xl border border-[#5E4B43]/40 bg-[#1B110D]/85 px-4 py-3 text-sm text-[#F7E6D4] shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur"
    >
      <div className="flex items-center gap-2">
        {dockApps.map((app) => {
          const Icon = app.icon
          return (
            <button
              key={app.id}
              type="button"
              aria-label={`Open ${app.title}`}
              onClick={() => onLaunch(app.id)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent text-[#F7E6D4]/80 transition hover:border-[#5E4B43]/50"
            >
              <Icon className="h-5 w-5" />
            </button>
          )
        })}
      </div>

      <div className="flex flex-1 items-center justify-center gap-2 px-4">
        {orderedWindows.map((win) => (
          <button
            key={win.id}
            type="button"
            onClick={() => {
              if (win.minimized) {
                onFocus(win.id)
              } else {
                minimizeWindow(win.id)
              }
            }}
            className={cn(
              "flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs uppercase tracking-[0.25em]",
              win.minimized
                ? "border-[#5E4B43]/40 text-[#F7E6D4]/60"
                : "border-[#F7E6D4]/60 text-[#F7E6D4] shadow-inner"
            )}
          >
            <span className="truncate max-w-[120px]">{win.title}</span>
          </button>
        ))}
        {!orderedWindows.length && <p className="text-xs text-[#F7E6D4]/50">No windows open</p>}
      </div>

      <button
        type="button"
        onClick={() => toggleTheme()}
        className="inline-flex items-center gap-2 rounded-2xl border border-[#5E4B43]/40 px-3 py-2 text-xs uppercase tracking-[0.25em] text-[#F7E6D4]/80 hover:text-[#F7E6D4]"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {theme === "dark" ? "Dawn" : "Dusk"}
      </button>
    </motion.footer>
  )
}
