import { useEffect } from "react"
import { motion } from "framer-motion"
import { useDashboardStore } from "@/store/dashboardStore"
import { nextCpuLoad, randomDelay } from "@/utils/randomLoad"

export function WidgetCpu() {
  const cpu = useDashboardStore((state) => state.system.cpu)
  const setSystemLoad = useDashboardStore((state) => state.actions.setSystemLoad)

  useEffect(() => {
    let timer: number
    const tick = () => {
      const current = useDashboardStore.getState().system.cpu
      setSystemLoad({ cpu: nextCpuLoad(current) })
      timer = window.setTimeout(tick, randomDelay(600, 1000))
    }
    timer = window.setTimeout(tick, 800)
    return () => clearTimeout(timer)
  }, [setSystemLoad])

  return (
    <motion.div layout className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-4 text-[#F2E4DC]">
      <p className="text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">CPU load</p>
      <p className="mt-2 text-3xl font-semibold">{cpu.toFixed(0)}%</p>
      <div className="mt-3 h-2 rounded-full bg-[#2E1F1B]">
        <div className="h-full rounded-full bg-[#5E4B43]" style={{ width: `${cpu}%` }} />
      </div>
      <p className="mt-2 text-xs text-[#F2E4DC]/60">Simulated workstation usage</p>
    </motion.div>
  )
}
