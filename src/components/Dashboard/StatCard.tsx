import { memo } from "react"
import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { TrendDirection } from "@/data/sampleDashboardStats"

interface StatCardProps {
  label: string
  value: string
  caption: string
  delta: number
  trend: TrendDirection
  icon: ReactNode
}

const trendLabel: Record<TrendDirection, string> = {
  up: "Increase",
  down: "Decrease",
}

const StatCardComponent = ({ label, value, caption, delta, trend, icon }: StatCardProps) => {
  const prefersReduced = useReducedMotion()
  return (
    <motion.article
      initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
      animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-4 text-[#F2E4DC] shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center justify-between text-sm text-[#F2E4DC]/70">
        <span className="uppercase tracking-[0.3em]">{label}</span>
        <span aria-hidden>{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      <p className="text-xs text-[#F2E4DC]/60">{caption}</p>
      <p className="mt-4 text-xs" aria-label={`${trendLabel[trend]} of ${Math.abs(delta)} percent`}>
        <span className={trend === "up" ? "text-emerald-300" : "text-rose-300"}>
          {trend === "up" ? "↑" : "↓"} {Math.abs(delta)}%
        </span>
        <span className="ml-2 text-[#F2E4DC]/60">vs last period</span>
      </p>
    </motion.article>
  )
}

export const StatCard = memo(StatCardComponent)
