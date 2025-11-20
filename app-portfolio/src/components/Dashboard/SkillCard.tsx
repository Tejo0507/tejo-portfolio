import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import type { SkillItem } from "@/store/dashboardStore"
import { getLevelLabel, getLevelTone, describeSkill } from "@/utils/skillHelpers"
import { ChevronRight } from "lucide-react"
import { formatRelative } from "@/utils/time"

interface SkillCardProps {
  skill: SkillItem
}

export function SkillCard({ skill }: SkillCardProps) {
  const [expanded, setExpanded] = useState(false)
  const prefersReduced = useReducedMotion()

  const toggle = () => setExpanded((value) => !value)

  return (
    <motion.article
      initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
      animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      className="rounded-2xl border border-[#5E4B43]/30 bg-[#1B120D] p-4 text-[#F2E4DC]"
    >
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5E4B43]"
        aria-expanded={expanded}
      >
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#F2E4DC]/60">{skill.category}</p>
          <p className="text-xl font-semibold">{skill.name}</p>
          <p className={`text-xs ${getLevelTone(skill.level)}`}>{getLevelLabel(skill.level)}</p>
        </div>
        <span className={`rounded-full border border-[#5E4B43]/40 p-1 transition ${expanded ? "rotate-90" : "rotate-0"}`}>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </span>
      </button>
      <div className="mt-4">
        <div
          role="progressbar"
          aria-valuenow={skill.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={describeSkill(skill)}
          className="h-2 rounded-full bg-[#2E1F1B]"
        >
          <div className="h-full rounded-full bg-[#5E4B43]" style={{ width: `${skill.progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-[#F2E4DC]/70">Updated {formatRelative(skill.latestUpdate)}</p>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={prefersReduced ? undefined : { height: 0, opacity: 0 }}
            animate={prefersReduced ? undefined : { height: "auto", opacity: 1 }}
            exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4 text-sm"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">Progress log</p>
              <ul className="mt-2 space-y-2">
                {skill.timeline.map((point) => (
                  <li key={point.id} className="rounded-xl border border-[#5E4B43]/30 px-3 py-2">
                    <p className="text-sm">{point.label}</p>
                    <p className="text-xs text-[#F2E4DC]/60">{point.note}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">Next up</p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-[#F2E4DC]/80">
                {skill.recommended.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
