import { motion, useReducedMotion } from "framer-motion"
import { useMemo } from "react"

interface SkillMeterProps {
  level: number
  label?: string
}

export default function SkillMeter({ level, label = "Proficiency" }: SkillMeterProps) {
  const shouldReduceMotion = useReducedMotion()
  const clamped = useMemo(() => Math.min(100, Math.max(0, level)), [level])

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-medium/70">
        <span>{label}</span>
        <span>{clamped}%</span>
      </div>
      <div
        className="h-3 rounded-full border border-medium/20 bg-dark/60"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-medium"
          initial={{ width: shouldReduceMotion ? `${clamped}%` : 0 }}
          whileInView={{ width: `${clamped}%` }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.45, 0.05, 0.25, 0.95] }}
        />
      </div>
    </div>
  )
}
