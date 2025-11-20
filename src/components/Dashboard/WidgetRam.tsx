import { useEffect } from "react"
import { motion } from "framer-motion"
import { useDashboardStore } from "@/store/dashboardStore"
import { nextRamLoad, randomDelay } from "@/utils/randomLoad"

export function WidgetRam() {
  const ram = useDashboardStore((state) => state.system.ram)
  const setSystemLoad = useDashboardStore((state) => state.actions.setSystemLoad)

  useEffect(() => {
    let timer: number
    const tick = () => {
      const current = useDashboardStore.getState().system.ram
      setSystemLoad({ ram: nextRamLoad(current) })
      timer = window.setTimeout(tick, randomDelay(700, 1100))
    }
    timer = window.setTimeout(tick, 900)
    return () => clearTimeout(timer)
  }, [setSystemLoad])

  return (
    <motion.div layout className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-4 text-[#F2E4DC]">
      <p className="text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">RAM usage</p>
      <p className="mt-2 text-3xl font-semibold">{ram.toFixed(0)}%</p>
      <div className="mt-3 grid grid-cols-4 gap-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className={`h-2 rounded-full ${ram / 12.5 > index ? "bg-[#5E4B43]" : "bg-[#2E1F1B]"}`} />
        ))}
      </div>
      <p className="mt-2 text-xs text-[#F2E4DC]/60">Virtualized env footprint</p>
    </motion.div>
  )
}
