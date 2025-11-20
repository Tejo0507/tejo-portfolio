import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { DaySchedule, TimeSlot } from "@/utils/timetableAlgo"

interface WeeklyTimetableProps {
  days: DaySchedule[]
  weekStart?: number
  id?: string
}

const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short" })

export function WeeklyTimetable({ days, weekStart = 0, id = "weekly-timetable" }: WeeklyTimetableProps) {
  const reduceMotion = useReducedMotion()
  const week = useMemo(() => days.slice(weekStart, weekStart + 7), [days, weekStart])

  if (!week.length) {
    return (
      <div className="rounded-3xl border border-[#5E4B43]/40 p-6 text-center text-sm text-[#F7E6D4]/70">
        Weekly view appears after generating a plan.
      </div>
    )
  }

  return (
    <motion.section
      id={id}
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-[#5E4B43]/40 bg-[#1B110D]/90 p-6 text-[#F7E6D4]"
    >
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/60">Weekly grid</p>
          <h3 className="text-xl font-semibold">{week[0] && new Date(week[0].date).toLocaleDateString()}</h3>
        </div>
        <p className="text-xs text-[#F7E6D4]/70">Keyboard tip: use Tab to jump into slots, Space to toggle.</p>
      </header>

      <div className="mt-6 overflow-x-auto" role="region" aria-label="Weekly timetable">
        <table className="w-full border-separate border-spacing-2 text-sm">
          <thead>
            <tr>
              <th className="text-left text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">Day</th>
              <th className="text-left text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">Slots</th>
            </tr>
          </thead>
          <tbody>
            {week.map((day) => (
              <tr key={day.id} className="align-top">
                <td className="whitespace-nowrap text-[#F7E6D4]/80">
                  <span className="text-base font-semibold text-[#F7E6D4]">
                    {dayFormatter.format(new Date(day.date))}
                  </span>
                  <p className="text-xs text-[#F7E6D4]/60">{new Date(day.date).toLocaleDateString()}</p>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {day.slots.map((slot) => (
                      <SlotPill key={slot.id} slot={slot} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  )
}

function SlotPill({ slot }: { slot: TimeSlot }) {
  const palette = {
    study: "bg-[#5E4B43] text-[#F7E6D4]",
    revision: "bg-[#F7E6D4]/10 text-[#F7E6D4]",
    break: "bg-transparent border border-[#5E4B43]/50 text-[#F7E6D4]/80",
    rest: "border border-dashed border-[#5E4B43]/40 text-[#F7E6D4]/60",
  }

  return (
    <button
      type="button"
      className={`rounded-full px-3 py-1 text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7E6D4] ${palette[slot.type]}`}
      aria-pressed={slot.status === "done"}
    >
      {slot.topicTitle ?? slot.notes ?? slot.type} · {slot.durationMinutes}m
    </button>
  )
}
