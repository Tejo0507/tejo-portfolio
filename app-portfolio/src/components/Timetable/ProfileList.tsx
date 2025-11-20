import { motion, useReducedMotion } from "framer-motion"
import { BookOpenCheck, Loader2, PlayCircle, Trash2 } from "lucide-react"
import { useTimetableStore } from "@/store/timetableStore"

export function ProfileList() {
  const reduceMotion = useReducedMotion()
  const profiles = useTimetableStore((state) => state.profiles)
  const activeProfileId = useTimetableStore((state) => state.activeProfileId)
  const setActiveProfile = useTimetableStore((state) => state.setActiveProfile)
  const deleteProfile = useTimetableStore((state) => state.deleteProfile)
  const generatePlan = useTimetableStore((state) => state.generatePlan)
  const generationStatus = useTimetableStore((state) => state.generationStatus)

  if (!profiles.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#5E4B43]/40 p-6 text-center text-sm text-[#F7E6D4]/70">
        No profiles saved yet.
      </div>
    )
  }

  return (
    <div className="space-y-3" aria-live="polite">
      {profiles.map((profile) => {
        const isActive = profile.id === activeProfileId
        return (
          <motion.article
            key={profile.id}
            layout
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border px-4 py-3 text-sm text-[#F7E6D4] transition ${
              isActive ? "border-[#F7E6D4] bg-[#5E4B43]/30" : "border-[#5E4B43]/40 bg-[#1C120F]"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold">{profile.name}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">
                  {profile.subjects.length} subjects · {profile.planSpanDays ?? 14} days
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveProfile(profile.id)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    isActive ? "bg-[#5E4B43] text-[#F7E6D4]" : "border border-[#5E4B43]/40"
                  }`}
                >
                  Focus
                </button>
                <button
                  type="button"
                  onClick={() => generatePlan(profile.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#F7E6D4]/30 px-3 py-1 text-xs text-[#F7E6D4]"
                  aria-label={`Generate plan for ${profile.name}`}
                >
                  {generationStatus === "running" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="h-4 w-4" />
                  )}
                  Generate
                </button>
                <button
                  type="button"
                  onClick={() => deleteProfile(profile.id)}
                  className="rounded-full border border-[#5E4B43]/40 p-1 text-[#F7E6D4]/70"
                  aria-label={`Delete ${profile.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.article>
        )
      })}
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/50">
        <BookOpenCheck className="h-4 w-4" /> Profiles autosave locally.
      </p>
    </div>
  )
}
