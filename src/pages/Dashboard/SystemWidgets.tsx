import { useState } from "react"
import { Sidebar } from "@/components/Dashboard/Sidebar"
import { TopBar } from "@/components/Dashboard/TopBar"
import { WidgetCpu } from "@/components/Dashboard/WidgetCpu"
import { WidgetRam } from "@/components/Dashboard/WidgetRam"
import { WidgetNetwork } from "@/components/Dashboard/WidgetNetwork"
import { WidgetClock } from "@/components/Dashboard/WidgetClock"
import { WidgetTodo } from "@/components/Dashboard/WidgetTodo"
import { motion } from "framer-motion"

export default function SystemWidgetsPage() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#0B0503] text-[#F2E4DC]">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 space-y-8 bg-[#120906]/60 p-6">
            <header className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">System widgets</p>
              <h1 className="text-3xl font-semibold">Playful telemetry</h1>
              <p className="text-sm text-[#F2E4DC]/70">Simulation-only stats that keep the dashboard lively.</p>
            </header>

            <section className="grid gap-4 md:grid-cols-3">
              <WidgetCpu />
              <WidgetRam />
              <WidgetNetwork />
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <WidgetClock />
              <WidgetTodo />
            </section>

            <motion.section className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm text-[#F2E4DC]/70">
                System widgets refresh every few hundred milliseconds via local timers only—no external telemetry involved. Keyboard support ensures
                every widget can be toggled or focused without lifting a mouse.
              </p>
            </motion.section>
          </main>
        </div>
      </div>
    </div>
  )
}
