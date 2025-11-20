import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"
import { useAdminAuth } from "@/store/adminAuth"
import { useAdminSettings } from "@/store/adminSettings"
import { AdminLoginForm } from "@/pages/Admin/Login"

interface AdminLayoutProps {
  children: ReactNode
  title?: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { isUnlocked, lockModalOpen, toggleLockModal, logout, registerActivity, shouldLock } = useAdminAuth()
  const { theme } = useAdminSettings()

  useEffect(() => {
    if (!isUnlocked) return
    const events = ["pointermove", "keydown", "click", "scroll"]
    const listener = () => registerActivity()
    events.forEach((evt) => window.addEventListener(evt, listener, { passive: true }))

    const timer = window.setInterval(() => {
      if (shouldLock()) {
        logout()
        toggleLockModal(true)
      }
    }, 15000)

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, listener))
      window.clearInterval(timer)
    }
  }, [isUnlocked, registerActivity, shouldLock, logout, toggleLockModal])

  const themeClass = useMemo(() => {
    switch (theme) {
      case "light":
        return "bg-[#F9F5F0] text-[#2E1F1B]"
      case "dark":
        return "bg-[#0B0503] text-[#F2E4DC]"
      default:
        return "bg-[#120906] text-[#F2E4DC]"
    }
  }, [theme])

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0B0503] text-[#F2E4DC]">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16">
          <AdminLoginForm inline />
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#120906] via-[#0B0503] to-[#2E1F1B] ${themeClass}`}>
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <div className="flex flex-1 flex-col">
          <TopBar collapsed={collapsed} onToggleMenu={() => setCollapsed((value) => !value)} title={title} />
          <main className="flex-1 overflow-y-auto bg-black/10 p-6 text-[#F2E4DC]">
            <div className="mx-auto max-w-6xl space-y-8">{children}</div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {lockModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <motion.div
              initial={{ y: prefersReducedMotion ? 0 : 32, opacity: prefersReducedMotion ? 1 : 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: prefersReducedMotion ? 0 : 32, opacity: prefersReducedMotion ? 1 : 0 }}
              className="w-[90%] max-w-lg"
            >
              <AdminLoginForm onSuccess={() => toggleLockModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
