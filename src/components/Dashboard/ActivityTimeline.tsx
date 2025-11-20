import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import type { ActivityItem } from "@/store/dashboardStore"
import { useDashboardStore } from "@/store/dashboardStore"
import { formatRelative, formatTimestamp } from "@/utils/time"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Clock, Sparkles } from "lucide-react"

const typeTone: Record<ActivityItem["type"], string> = {
  project: "text-emerald-300",
  learning: "text-sky-300",
  ai: "text-amber-300",
  achievement: "text-violet-300",
}

export function ActivityTimeline() {
  const activities = useDashboardStore((state) => state.activity)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const prefersReduced = useReducedMotion()

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  return (
    <section aria-label="Activity timeline" className="space-y-4">
      <header className="flex items-center justify-between text-sm text-[#F2E4DC]/70">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/50">Activity</p>
          <p>Recent releases, experiments, and learning notes.</p>
        </div>
        <Sparkles className="h-5 w-5 text-[#F2E4DC]/70" aria-hidden />
      </header>
      <ul className="space-y-3">
        {activities.map((activity) => {
          const isOpen = expandedId === activity.id
          return (
            <li key={activity.id}>
              <motion.button
                type="button"
                onClick={() => toggle(activity.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    toggle(activity.id)
                  }
                }}
                initial={prefersReduced ? undefined : { opacity: 0, y: 10 }}
                animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full rounded-2xl border border-[#5E4B43]/30 bg-[#1B120D] px-4 py-3 text-left text-[#F2E4DC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5E4B43]"
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-[#F2E4DC]/60">{activity.summary}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#F2E4DC]/70">
                      <span className={`flex items-center gap-1 ${typeTone[activity.type]}`}>
                        <Clock className="h-3 w-3" /> {formatRelative(activity.timestamp)}
                      </span>
                      {activity.tags.map((tag) => (
                        <Badge key={`${activity.id}-${tag}`} className="border-[#5E4B43]/40 text-[11px]">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <span className="rounded-full border border-[#5E4B43]/40 p-1 text-[#F2E4DC]/60">
                    <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : "rotate-0"}`} aria-hidden />
                  </span>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                      animate={prefersReduced ? undefined : { height: "auto", opacity: 1 }}
                      exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 text-sm text-[#F2E4DC]/80"
                    >
                      <p>{activity.details}</p>
                      <p className="mt-2 text-xs text-[#F2E4DC]/50">Logged {formatTimestamp(activity.timestamp)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
