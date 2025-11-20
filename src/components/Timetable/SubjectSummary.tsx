import { motion, useReducedMotion } from "framer-motion"
import type { SubjectSummary } from "@/utils/timetableAlgo"

interface SubjectSummaryProps {
  summaries: SubjectSummary[]
}

export function SubjectSummaryList({ summaries }: SubjectSummaryProps) {
  const reduceMotion = useReducedMotion()
  if (!summaries.length) {
    return (
      <div className="rounded-3xl border border-[#5E4B43]/40 p-6 text-center text-sm text-[#F7E6D4]/60">
        Subject summaries appear after generating a plan.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {summaries.map((summary, index) => (
        <motion.article
          key={summary.subjectId}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.35 }}
          className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B100C] p-4 text-[#F7E6D4]"
        >
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">Subject</p>
              <h4 className="text-lg font-semibold">{summary.name}</h4>
            </div>
            <span className="text-sm text-[#F7E6D4]/70">{Math.round(summary.completionEstimate * 100)}%</span>
          </header>
          <div className="mt-3 h-2 rounded-full bg-[#2E1F1B]">
            <div
              className="h-full rounded-full bg-[#5E4B43]"
              style={{ width: `${Math.min(100, Math.round(summary.completionEstimate * 100))}%` }}
            />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#F7E6D4]/70">
            <div>
              <dt>Allocated</dt>
              <dd className="text-base text-[#F7E6D4]">{Math.round(summary.allocatedMinutes / 60)}h</dd>
            </div>
            <div>
              <dt>Remaining</dt>
              <dd className="text-base text-[#F7E6D4]">{Math.round(summary.remainingMinutes / 60)}h</dd>
            </div>
            {summary.nextSession && (
              <div className="col-span-2 text-sm text-[#F7E6D4]/80">Next: {summary.nextSession}</div>
            )}
          </dl>
        </motion.article>
      ))}
    </div>
  )
}
