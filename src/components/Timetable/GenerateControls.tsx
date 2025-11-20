import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Loader2, Power } from "lucide-react"
import { useTimetableStore } from "@/store/timetableStore"
import type { GeneratePlanOptions } from "@/utils/timetableAlgo"

interface GenerateControlsProps {
  onPlanGenerated?: () => void
}

export function GenerateControls({ onPlanGenerated }: GenerateControlsProps) {
  const reduceMotion = useReducedMotion()
  const activeProfileId = useTimetableStore((state) => state.activeProfileId)
  const generatePlan = useTimetableStore((state) => state.generatePlan)
  const generationProgress = useTimetableStore((state) => state.generationProgress)
  const generationStatus = useTimetableStore((state) => state.generationStatus)
  const cancelGeneration = useTimetableStore((state) => state.cancelGeneration)
  
  const [options, setOptions] = useState<GeneratePlanOptions>({ days: 14, revisionFrequencyDays: 3, includeRestDays: true })

  const disabled = !activeProfileId || generationStatus === "running"

  const handleGenerate = async () => {
    if (!activeProfileId) return
    const plan = await generatePlan(activeProfileId, options)
    if (plan && onPlanGenerated) onPlanGenerated()
  }

  return (
    <motion.section
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-[#5E4B43]/40 bg-[#2B1B16] p-6 text-[#F7E6D4]"
    >
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/60">Generator</p>
          <h3 className="text-xl font-semibold">Plan controls</h3>
        </div>
        {generationStatus === "running" && (
          <div className="flex items-center gap-3 text-sm text-[#F7E6D4]/80" role="status">
            <Loader2 className="h-4 w-4 animate-spin" />
            Rendering timetable… {generationProgress}%
            <button
              type="button"
              onClick={cancelGeneration}
              className="rounded-full border border-[#F7E6D4]/40 px-3 py-1 text-xs"
            >
              Cancel
            </button>
          </div>
        )}
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="text-sm">
          <span className="text-[#F7E6D4]/70">Range (days)</span>
          <input
            type="number"
            min={7}
            max={60}
            value={options.days}
            onChange={(event) => setOptions((prev) => ({ ...prev, days: Number(event.target.value) }))}
            className="mt-1 w-full rounded-2xl border border-[#5E4B43]/40 bg-transparent px-3 py-2 text-[#F7E6D4]"
          />
        </label>
        <label className="text-sm">
          <span className="text-[#F7E6D4]/70">Revision every (days)</span>
          <input
            type="number"
            min={1}
            max={7}
            value={options.revisionFrequencyDays}
            onChange={(event) => setOptions((prev) => ({ ...prev, revisionFrequencyDays: Number(event.target.value) }))}
            className="mt-1 w-full rounded-2xl border border-[#5E4B43]/40 bg-transparent px-3 py-2 text-[#F7E6D4]"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-[#F7E6D4]/80">
          <input
            type="checkbox"
            checked={options.includeRestDays}
            onChange={(event) => setOptions((prev) => ({ ...prev, includeRestDays: event.target.checked }))}
            className="h-4 w-4 rounded border-[#5E4B43]/70 bg-transparent text-[#5E4B43] focus:ring-[#F7E6D4]"
          />
          Respect rest buffers
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#5E4B43] px-6 py-3 text-base font-semibold text-[#F7E6D4] disabled:opacity-50"
        >
          <Power className="h-5 w-5" /> Generate plan
        </button>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">
          {generationStatus === "success" ? "Plan refreshed" : "Awaiting run"}
        </div>
      </div>
    </motion.section>
  )
}
