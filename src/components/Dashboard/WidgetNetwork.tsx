import { useEffect } from "react"
import { motion } from "framer-motion"
import { useDashboardStore } from "@/store/dashboardStore"
import { nextNetworkLoad, randomDelay } from "@/utils/randomLoad"

export function WidgetNetwork() {
  const net = useDashboardStore((state) => state.system.net)
  const setSystemLoad = useDashboardStore((state) => state.actions.setSystemLoad)

  useEffect(() => {
    let timer: number
    const tick = () => {
      const current = useDashboardStore.getState().system.net
      setSystemLoad({ net: nextNetworkLoad(current) })
      timer = window.setTimeout(tick, randomDelay(500, 900))
    }
    timer = window.setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [setSystemLoad])

  return (
    <motion.div layout className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-4 text-[#F2E4DC]">
      <p className="text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">Network speed</p>
      <p className="mt-2 text-3xl font-semibold">{net.toFixed(0)} Mbps</p>
      <div className="mt-3 h-16 rounded-xl border border-[#5E4B43]/30 bg-[#120906]">
        <div className="h-full rounded-xl bg-gradient-to-r from-[#5E4B43] to-[#F2E4DC]/70" style={{ width: `${net}%` }} />
      </div>
      <p className="mt-2 text-xs text-[#F2E4DC]/60">Simulated peek throughput</p>
    </motion.div>
  )
}
