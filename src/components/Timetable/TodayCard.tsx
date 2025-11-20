import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Sparkles, Timer, Zap } from "lucide-react"
import type { TimetablePlan } from "@/utils/timetableAlgo"

interface TodayCardProps {
  plan: TimetablePlan | null
}

export function TodayCard({ plan }: TodayCardProps) {
  const reduceMotion = useReducedMotion()
  const today = useMemo(() => plan?.days.find((day) => day.date === new Date().toISOString().split("T")[0]) ?? plan?.days[0], [plan])

  if (!plan || !today) {
    return (
      <div className="rounded-3xl border border-[#5E4B43]/40 bg-[#1D110D]/90 p-6 text-center text-sm text-[#F7E6D4]/70">
        Run the generator to see today's focus.
      </div>
    )
  }

  const totalFocus = today.slots.filter((slot) => slot.type === "study").reduce((sum, slot) => sum + slot.durationMinutes, 0)
  const completed = today.slots.filter((slot) => slot.status === "done").reduce((sum, slot) => sum + slot.durationMinutes, 0)
  const progress = totalFocus ? Math.min(100, Math.round((completed / totalFocus) * 100)) : 0
  const nextUp = today.slots.find((slot) => slot.status !== "done" && slot.type === "study")

  return (
    <motion.section
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      className="rounded-3xl border border-[#5E4B43]/40 bg-gradient-to-br from-[#2E1F1B] to-[#1A0F0B] p-6 text-[#F7E6D4] shadow-2xl"
    >
      <header className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-[#F7E6D4]" />
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/70">Today</p>
          <h3 className="text-2xl font-semibold">{new Date(today.date).toLocaleDateString(undefined, { weekday: "long" })}</h3>
        </div>
      </header>
      <p className="mt-4 text-sm text-[#F7E6D4]/80">
        Next up: {nextUp ? `${nextUp.topicTitle ?? "Focus"} (${nextUp.startTime})` : "All tasks cleared"}
      </p>
      <div className="mt-4 h-2 rounded-full bg-[#4A322B]">
        <div className="h-full rounded-full bg-[#F7E6D4]/80" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#F7E6D4]/80">
        <div className="rounded-2xl border border-[#5E4B43]/40 p-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">Focus minutes</p>
          <p className="flex items-center gap-2 text-xl font-semibold text-[#F7E6D4]">
            <Timer className="h-4 w-4" /> {totalFocus}m
          </p>
        </div>
        <div className="rounded-2xl border border-[#5E4B43]/40 p-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">Completed</p>
          <p className="flex items-center gap-2 text-xl font-semibold text-[#F7E6D4]">
            <Zap className="h-4 w-4" /> {progress}%
          </p>
        </div>
      </div>
    </motion.section>
  )
}
