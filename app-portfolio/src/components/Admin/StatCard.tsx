import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/utils"

interface StatCardProps {
  label: string
  value: string
  delta?: string
  icon?: ReactNode
  accent?: string
}

export function StatCard({ label, value, delta, icon, accent = "#5E4B43" }: StatCardProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      initial={{ y: prefersReducedMotion ? 0 : 24, opacity: prefersReducedMotion ? 1 : 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D]/80 p-5 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-[#F6F2EE]">{value}</p>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#5E4B43]/30"
          style={{ background: `${accent}22` }}
        >
          {icon}
        </div>
      </div>
      {delta ? <p className={cn("mt-3 text-sm", delta.startsWith("-") ? "text-rose-300" : "text-emerald-300")}>{delta}</p> : null}
    </motion.article>
  )
}
