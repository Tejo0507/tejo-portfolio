import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CheckCircle2, CornerDownRight, RotateCcw } from "lucide-react"
import { useTimetableStore } from "@/store/timetableStore"
import type { DaySchedule, TimeSlot } from "@/utils/timetableAlgo"

interface DailyPlannerProps {
  days: DaySchedule[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

export function DailyPlanner({ days, selectedDate, onSelectDate }: DailyPlannerProps) {
  const reduceMotion = useReducedMotion()
  const markSlotDone = useTimetableStore((state) => state.markSlotDone)
  const moveSlotToDay = useTimetableStore((state) => state.moveSlotToDay)

  const day = useMemo(() => days.find((entry) => entry.date === selectedDate) ?? days[0], [days, selectedDate])
  if (!day) {
    return (
      <div className="rounded-3xl border border-[#5E4B43]/40 p-6 text-center text-sm text-[#F7E6D4]/70">
        Generate a plan to view the daily breakdown.
      </div>
    )
  }

  const nextDates = days.filter((entry) => entry.date !== day.date)

  return (
    <motion.section
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-[#5E4B43]/40 bg-[#1E1410]/90 p-6 text-[#F7E6D4]"
    >
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/70">Daily planner</p>
          <h3 className="text-xl font-semibold">{new Date(day.date).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {days.slice(0, 7).map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`rounded-full px-3 py-1 ${entry.date === day.date ? "bg-[#5E4B43] text-[#F7E6D4]" : "border border-[#5E4B43]/40"}`}
              onClick={() => onSelectDate(entry.date)}
            >
              {new Date(entry.date).toLocaleDateString(undefined, { weekday: "short" })}
            </button>
          ))}
        </div>
      </header>

      <ol className="mt-5 space-y-3" aria-live="polite">
        {day.slots.map((slot) => (
          <li key={slot.id}>
            <SlotCard
              slot={slot}
              date={day.date}
              onToggle={() => markSlotDone(day.date, slot.id)}
              onMove={(targetDate) => moveSlotToDay(slot.id, day.date, targetDate)}
              nextDates={nextDates}
            />
          </li>
        ))}
      </ol>
    </motion.section>
  )
}

interface SlotCardProps {
  slot: TimeSlot
  date: string
  onToggle: () => void
  onMove: (targetDate: string) => void
  nextDates: DaySchedule[]
}

function SlotCard({ slot, onToggle, onMove, nextDates }: SlotCardProps) {
  const isDone = slot.status === "done"
  const badgeColor =
    slot.type === "study"
      ? "bg-[#5E4B43]/70"
      : slot.type === "revision"
      ? "bg-[#F7E6D4]/20"
      : slot.type === "break"
      ? "bg-[#2E1F1B]/70"
      : "bg-transparent"

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm transition ${
        isDone ? "border-[#F7E6D4]/50 bg-[#2E1F1B]/70" : "border-[#5E4B43]/40 bg-[#160C09]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/50">
            {slot.type} · {slot.startTime} – {slot.endTime}
          </p>
          <p className="text-lg font-semibold text-[#F7E6D4]">
            {slot.topicTitle ?? slot.notes ?? "Focus session"}
          </p>
          {slot.notes && <p className="text-xs text-[#F7E6D4]/70">{slot.notes}</p>}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs text-[#F7E6D4] ${badgeColor}`}>{slot.durationMinutes}m</span>
      </div>
      {slot.type !== "break" && slot.type !== "rest" && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggle}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
              isDone
                ? "border-[#F7E6D4]/50 text-[#F7E6D4]"
                : "border-[#5E4B43]/40 text-[#F7E6D4]/80"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" /> {isDone ? "Mark pending" : "Mark done"}
          </button>
          <div className="relative inline-flex items-center">
            <CornerDownRight className="mr-2 h-4 w-4 text-[#F7E6D4]/50" />
            <select
              className="rounded-full border border-[#5E4B43]/40 bg-transparent px-3 py-1 text-xs text-[#F7E6D4]"
              onChange={(event) => event.target.value && onMove(event.target.value)}
              defaultValue=""
              aria-label="Reschedule"
            >
              <option value="" disabled>
                Move to…
              </option>
              {nextDates.slice(0, 5).map((entry) => (
                <option key={entry.id} value={entry.date} className="bg-[#2E1F1B] text-[#F7E6D4]">
                  {new Date(entry.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {slot.status === "missed" && (
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#5E4B43]/40 px-3 py-1 text-xs text-[#F7E6D4]/80">
          <RotateCcw className="h-4 w-4" /> Auto-reschedule suggested
        </p>
      )}
    </div>
  )
}
