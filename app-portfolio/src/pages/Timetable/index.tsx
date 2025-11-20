import { Suspense, lazy, useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { AlertTriangle, Download, FileDown } from "lucide-react"
import { ProfileForm } from "@/components/Timetable/ProfileForm"
import { ProfileList } from "@/components/Timetable/ProfileList"
import { GenerateControls } from "@/components/Timetable/GenerateControls"
import { DailyPlanner } from "@/components/Timetable/DailyPlanner"
import { WeeklyTimetable } from "@/components/Timetable/WeeklyTimetable"
import { SubjectSummaryList } from "@/components/Timetable/SubjectSummary"
import { TodayCard } from "@/components/Timetable/TodayCard"
import { useTimetableStore } from "@/store/timetableStore"
import type { TimetablePlan } from "@/utils/timetableAlgo"

const PdfExportSection = lazy(async () => {
  const helpers = await import("@/utils/pdfExport")
  const Component = ({ plan }: { plan: TimetablePlan | null }) => {
    if (!plan) {
      return (
        <div className="rounded-2xl border border-[#5E4B43]/40 p-4 text-sm text-[#F7E6D4]/70">
          Export options activate after generating a plan.
        </div>
      )
    }

    return (
      <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B110D]/80 p-4 text-sm text-[#F7E6D4]">
        <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/60">Export</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => helpers.exportPlanToJson(plan)}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#5E4B43]/50 px-4 py-2"
          >
            <Download className="h-4 w-4" /> JSON
          </button>
          <button
            type="button"
            onClick={() => helpers.exportPlanSnapshot(plan, ["weekly-timetable"])}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#5E4B43]/50 px-4 py-2"
          >
            <FileDown className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>
    )
  }
  return { default: Component }
})

export default function TimetablePage() {
  const reduceMotion = useReducedMotion()
  const profiles = useTimetableStore((state) => state.profiles)
  const activeProfileId = useTimetableStore((state) => state.activeProfileId)
  const currentPlan = useTimetableStore((state) => state.currentPlan)
  const adjustAfterMissed = useTimetableStore((state) => state.adjustAfterMissed)
  
  const activeProfile = useMemo(
    () => profiles.find((profile) => profile.id === activeProfileId) ?? null,
    [profiles, activeProfileId],
  )
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const planDays = useMemo(() => currentPlan?.days ?? [], [currentPlan])
  const activeDate = useMemo(() => {
    if (!planDays.length) return null
    return selectedDate && planDays.some((day) => day.date === selectedDate)
      ? selectedDate
      : planDays[0].date
  }, [planDays, selectedDate])

  return (
    <motion.main
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 bg-[#120906] px-4 py-10 text-[#F7E6D4] sm:px-8"
    >
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/60">Study lab</p>
        <h1 className="text-3xl font-semibold text-[#F7E6D4]">Timetable generator</h1>
        <p className="max-w-2xl text-sm text-[#F7E6D4]/80">
          Build tailored study profiles, balance revision with rest, and export polished timetables. Everything stays offline in your browser.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <ProfileForm key={activeProfile?.id ?? "new-profile"} profile={activeProfile} />
          <GenerateControls />
        </div>
        <aside className="space-y-4">
          <ProfileList />
          <TodayCard plan={currentPlan} />
          <Suspense fallback={<div className="rounded-2xl border border-[#5E4B43]/40 p-4 text-sm text-[#F7E6D4]/70">Loading export tools…</div>}>
            <PdfExportSection plan={currentPlan} />
          </Suspense>
        </aside>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <DailyPlanner days={planDays} selectedDate={activeDate} onSelectDate={setSelectedDate} />
        <WeeklyTimetable days={planDays} />
      </section>

      <SubjectSummaryList summaries={currentPlan?.subjectSummaries ?? []} />

      {currentPlan && (
        <div className="rounded-3xl border border-[#5E4B43]/40 bg-[#1E1410]/80 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-sm text-[#F7E6D4]/80">
              <AlertTriangle className="h-5 w-5 text-[#F7E6D4]" /> Missed a day?
            </div>
            <button
              type="button"
              disabled={!activeDate}
              onClick={() => activeDate && adjustAfterMissed(activeDate)}
              className="rounded-2xl border border-[#5E4B43]/50 px-4 py-2 text-sm disabled:opacity-50"
            >
              Rebalance from selected day
            </button>
          </div>
        </div>
      )}
    </motion.main>
  )
}
