import type { ReactNode } from "react"
import { useCallback } from "react"
import { motion, useDragControls, useReducedMotion } from "framer-motion"
import { useOSStore, type WindowState } from "@/store/osStore"
import { X, Minus, Maximize2 } from "lucide-react"

interface Props {
  window: WindowState
  children: ReactNode
}

export function WindowWrapper({ window: win, children }: Props) {
  const prefersReducedMotion = useReducedMotion()
  const dragControls = useDragControls()
  const closeWindow = useOSStore((state) => state.closeWindow)
  const minimizeWindow = useOSStore((state) => state.minimizeWindow)
  const maximizeWindow = useOSStore((state) => state.maximizeWindow)
  const updateWindowPosition = useOSStore((state) => state.updateWindowPosition)
  const updateWindowSize = useOSStore((state) => state.updateWindowSize)
  const setActiveWindow = useOSStore((state) => state.setActiveWindow)

  const handleResize = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const startX = event.clientX
      const startY = event.clientY
  const { width, height } = win.size

      const handleMove = (moveEvent: PointerEvent) => {
        const nextWidth = width + (moveEvent.clientX - startX)
        const nextHeight = height + (moveEvent.clientY - startY)
        updateWindowSize(win.id, { width: nextWidth, height: nextHeight })
      }

      const handleUp = () => {
        globalThis.window?.removeEventListener("pointermove", handleMove)
        globalThis.window?.removeEventListener("pointerup", handleUp)
      }

      globalThis.window?.addEventListener("pointermove", handleMove)
      globalThis.window?.addEventListener("pointerup", handleUp)
    },
    [win.id, win.size, updateWindowSize]
  )

  const headerActions = [
    { label: "Minimize", icon: <Minus className="h-4 w-4" />, action: () => minimizeWindow(win.id) },
    { label: "Maximize", icon: <Maximize2 className="h-4 w-4" />, action: () => maximizeWindow(win.id) },
    { label: "Close", icon: <X className="h-4 w-4" />, action: () => closeWindow(win.id) },
  ]

  const isMaximized = win.maximized
  const bodyStyle = isMaximized
    ? { left: 16, top: 16, width: `calc(100% - 32px)`, height: `calc(100% - 96px)` }
    : { left: win.position.x, top: win.position.y, width: win.size.width, height: win.size.height }

  return (
    <motion.section
      role="dialog"
  aria-label={win.title}
      drag={!isMaximized}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        updateWindowPosition(win.id, { x: win.position.x + info.offset.x, y: win.position.y + info.offset.y })
      }}
      onPointerDown={() => setActiveWindow(win.id)}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.45, 0.05, 0.25, 0.95] }}
      className="absolute rounded-[28px] border border-[#5E4B43]/40 bg-[#1C120D]/95 shadow-[0_40px_140px_rgba(0,0,0,0.65)] backdrop-blur"
      style={{ zIndex: win.zIndex, ...bodyStyle }}
    >
      <header
        className="flex items-center justify-between rounded-t-[28px] border-b border-[#5E4B43]/30 bg-[#120906]/60 px-5 py-3"
        onPointerDown={(event) => {
          dragControls.start(event)
        }}
        onDoubleClick={() => maximizeWindow(win.id)}
      >
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-[#F7E6D4]/70">
          <span className="h-2 w-2 rounded-full bg-[#5E4B43]" />
          {win.title}
        </div>
        <div className="flex items-center gap-2">
          {headerActions.map((action) => (
            <button
              key={action.label}
              type="button"
              aria-label={action.label}
              onClick={(event) => {
                event.stopPropagation()
                action.action()
              }}
              className="flex h-8 w-8 items-center justify-center rounded-2xl border border-[#5E4B43]/30 text-[#F7E6D4]/80 hover:text-[#F7E6D4]"
            >
              {action.icon}
            </button>
          ))}
        </div>
      </header>
      <div className="h-[calc(100%-56px)] overflow-hidden rounded-b-[28px] bg-[#2E1F1B]/70">
        <div className="h-full overflow-auto p-4 text-sm text-[#F7E6D4]/90">{children}</div>
      </div>
      {!isMaximized && (
        <div
          role="presentation"
          className="absolute bottom-2 right-2 h-6 w-6 cursor-nwse-resize rounded-full border border-dashed border-[#5E4B43]/50"
          onPointerDown={handleResize}
        />
      )}
    </motion.section>
  )
}
