import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { formatClock, getWorldTimes, type WorldClockEntry } from "@/utils/time"

export function WidgetClock() {
  const [now, setNow] = useState(() => formatClock())
  const [world, setWorld] = useState<WorldClockEntry[]>(() => getWorldTimes(worldCities))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(formatClock())
      setWorld(getWorldTimes(worldCities))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div layout className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-4 text-[#F2E4DC]">
      <p className="text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">Clock</p>
      <p className="mt-2 text-3xl font-semibold" aria-live="polite">
        {now}
      </p>
      <div className="mt-3 grid gap-2 text-sm text-[#F2E4DC]/80">
        {world.map((entry) => (
          <div key={entry.city} className="flex items-center justify-between rounded-xl border border-[#5E4B43]/20 px-3 py-1.5">
            <span>{entry.city}</span>
            <span>{entry.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const worldCities = [
  { city: "San Francisco", timezone: "America/Los_Angeles" },
  { city: "London", timezone: "Europe/London" },
  { city: "Hyderabad", timezone: "Asia/Kolkata" },
]
