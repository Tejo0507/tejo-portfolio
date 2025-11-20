import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import type { SkillItem } from "@/data/sampleSkills"

interface SkillEditorProps {
  skill: SkillItem | null
  open: boolean
  onClose: () => void
  onSave: (data: Partial<SkillItem>) => void
  onDelete?: () => void
  onAddTimeline?: (payload: { label: string; delta: number; note: string }) => void
}

const levels: SkillItem["level"][] = ["beginner", "intermediate", "advanced"]

export function SkillEditor({ skill, open, onClose, onSave, onDelete, onAddTimeline }: SkillEditorProps) {
  const prefersReducedMotion = useReducedMotion()
  const [name, setName] = useState(() => skill?.name ?? "")
  const [category, setCategory] = useState(() => skill?.category ?? "")
  const [level, setLevel] = useState<SkillItem["level"]>(() => skill?.level ?? "beginner")
  const [progress, setProgress] = useState(() => skill?.progress ?? 0)
  const [recommended, setRecommended] = useState(() => (skill ? skill.recommended.join(", ") : ""))
  const [timelineLabel, setTimelineLabel] = useState("")
  const [timelineDelta, setTimelineDelta] = useState(2)
  const [timelineNote, setTimelineNote] = useState("")

  const handleSave = useCallback(() => {
    if (!skill) return
    onSave({
      name,
      category,
      level,
      progress,
      recommended: recommended
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    })
  }, [skill, name, category, level, progress, recommended, onSave])

  const handleAddTimeline = () => {
    if (!skill || !timelineLabel.trim()) return
    onAddTimeline?.({ label: timelineLabel, delta: timelineDelta, note: timelineNote })
    setTimelineLabel("")
    setTimelineDelta(2)
    setTimelineNote("")
  }

  useEffect(() => {
    if (!open || !skill) return
    const handleKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault()
        handleSave()
      } else if (event.key === "Escape") {
        event.preventDefault()
        onClose()
      } else if (event.key === "Delete" && onDelete) {
        event.preventDefault()
        onDelete()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, skill, handleSave, onClose, onDelete])

  return (
    <AnimatePresence>
      {open && skill ? (
        <motion.aside
          className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-[#5E4B43]/30 bg-[#120906] p-6 text-[#F2E4DC]"
          initial={{ x: prefersReducedMotion ? 0 : 420 }}
          animate={{ x: 0 }}
          exit={{ x: prefersReducedMotion ? 0 : 420 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Skill editor</p>
              <h2 className="text-xl font-semibold">{skill.name}</h2>
            </div>
            <Button variant="outline" className="border-[#5E4B43]/40 text-[#F2E4DC]" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            <label className="space-y-2 text-sm">
              <span>Name</span>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="space-y-2 text-sm">
              <span>Category</span>
              <Input value={category} onChange={(event) => setCategory(event.target.value)} />
            </label>
            <label className="space-y-2 text-sm">
              <span>Level</span>
              <Select value={level} onChange={(event) => setLevel(event.target.value as SkillItem["level"]) }>
                {levels.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2 text-sm">
              <span>Progress %</span>
              <Input type="number" value={progress} onChange={(event) => setProgress(Number(event.target.value))} min={0} max={100} />
            </label>
            <label className="space-y-2 text-sm">
              <span>Recommendations</span>
              <Textarea rows={3} value={recommended} onChange={(event) => setRecommended(event.target.value)} />
            </label>
          </div>

          <div className="mt-8 space-y-2 rounded-2xl border border-[#5E4B43]/30 p-4">
            <p className="text-sm font-semibold">Timeline event</p>
            <label className="space-y-2 text-sm">
              <span>Label</span>
              <Input value={timelineLabel} onChange={(event) => setTimelineLabel(event.target.value)} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Delta</span>
                <Input type="number" value={timelineDelta} onChange={(event) => setTimelineDelta(Number(event.target.value))} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Note</span>
                <Input value={timelineNote} onChange={(event) => setTimelineNote(event.target.value)} />
              </label>
            </div>
            <Button className="w-full bg-[#5E4B43] text-[#120906]" onClick={handleAddTimeline}>
              Add timeline entry
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="bg-[#5E4B43] text-[#120906]" onClick={handleSave}>
              Save skill
            </Button>
            {onDelete ? (
              <Button variant="outline" className="border-rose-500/40 text-rose-200" onClick={onDelete}>
                Remove skill
              </Button>
            ) : null}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
