import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/Admin/AdminLayout"
import { SkillEditor } from "@/components/Admin/SkillEditor"
import { useAdminSkillStore } from "@/store/skillStore"
import type { SkillItem } from "@/data/sampleSkills"
import { cn } from "@/utils"
import { ConfirmDialog } from "@/components/Admin/ConfirmDialog"

export default function AdminSkillsPage() {
  const skills = useAdminSkillStore((state) => state.skills)
  const selectedId = useAdminSkillStore((state) => state.selectedId)
  const setSelected = useAdminSkillStore((state) => state.setSelected)
  const createSkill = useAdminSkillStore((state) => state.createSkill)
  const updateSkill = useAdminSkillStore((state) => state.updateSkill)
  const deleteSkill = useAdminSkillStore((state) => state.deleteSkill)
  const addTimelineEvent = useAdminSkillStore((state) => state.addTimelineEvent)
  const drawerOpen = useAdminSkillStore((state) => state.drawerOpen)
  const toggleDrawer = useAdminSkillStore((state) => state.toggleDrawer)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const currentSkill = useMemo(() => skills.find((skill) => skill.id === selectedId) ?? null, [skills, selectedId])

  const timelineStream = useMemo(() => {
    return skills
      .flatMap((skill) =>
        skill.timeline.map((event, index) => {
          const base = new Date(skill.latestUpdate).getTime() || Date.now()
          return {
            ...event,
            skillName: skill.name,
            timestamp: base - index * 600000,
          }
        })
      )
      .sort((a, b) => b.timestamp - a.timestamp)
  }, [skills])

  const createNewSkill = useCallback(() => {
    createSkill()
    toggleDrawer(true)
  }, [createSkill, toggleDrawer])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName.toLowerCase()
        if (["input", "textarea"].includes(tag)) return
      }
      if (event.key.toLowerCase() === "n") {
        event.preventDefault()
        createNewSkill()
      }
    }
    window.addEventListener("keydown", handler)
    const newListener = () => createNewSkill()
    document.addEventListener("admin-skill-new", newListener)
    return () => {
      window.removeEventListener("keydown", handler)
      document.removeEventListener("admin-skill-new", newListener)
    }
  }, [createNewSkill])

  const deleteTarget = useMemo(() => skills.find((skill) => skill.id === pendingDelete) ?? null, [pendingDelete, skills])

  const handleSave = (data: Partial<SkillItem>) => {
    if (!currentSkill) return
    updateSkill(currentSkill.id, data)
  }

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    deleteSkill(pendingDelete)
    setPendingDelete(null)
    toggleDrawer(false)
  }

  return (
    <AdminLayout title="Skills">
      <div className="flex flex-wrap items-center gap-4">
        <Button className="bg-[#5E4B43] text-[#120906]" onClick={createNewSkill}>
          Add skill
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <article
            key={skill.id}
            className={cn(
              "rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D]/80 p-5",
              selectedId === skill.id && "border-[#5E4B43] shadow-lg"
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{skill.category}</p>
                <h3 className="text-xl font-semibold text-[#F2E4DC]">{skill.name}</h3>
                <p className="text-sm text-[#F2E4DC]/70">Level: {skill.level}</p>
              </div>
              <Button variant="outline" className="border-[#5E4B43]/40 text-[#F2E4DC]" onClick={() => { setSelected(skill.id); toggleDrawer(true) }}>
                Edit
              </Button>
            </div>
            <div className="mt-4">
              <div className="h-3 w-full rounded-full bg-[#2E1F1B]/60">
                <div className="h-3 rounded-full bg-[#5E4B43]" style={{ width: `${skill.progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-[#F2E4DC]/60">{skill.progress}% focus</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#F2E4DC]/60">
              {skill.recommended.map((entry) => (
                <span key={entry} className="rounded-full border border-[#5E4B43]/30 px-3 py-1">
                  {entry}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D]/80 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Timeline</p>
            <h2 className="text-2xl font-semibold text-[#F2E4DC]">Recent skill moves</h2>
          </div>
          <p className="text-xs text-[#F2E4DC]/60">{timelineStream.length} entries</p>
        </div>
        <ol className="mt-6 space-y-4">
          {timelineStream.slice(0, 10).map((event) => (
            <li
              key={event.id}
              className="flex items-start gap-3 rounded-2xl border border-[#5E4B43]/20 bg-[#120906]/60 px-4 py-3"
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-[#5E4B43]" aria-hidden />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#F2E4DC]">{event.skillName}</p>
                  <p className="text-xs text-[#F2E4DC]/60">{new Date(event.timestamp).toLocaleString()}</p>
                </div>
                <p className="text-sm text-[#F2E4DC]/80">{event.label}</p>
                <p className="text-xs text-[#F2E4DC]/60">{event.note}</p>
              </div>
              <span className="rounded-full border border-[#5E4B43]/40 px-3 py-1 text-xs text-[#F2E4DC]/80">+{event.delta}</span>
            </li>
          ))}
        </ol>
      </section>

      <SkillEditor
        key={currentSkill?.id ?? "empty"}
        skill={currentSkill}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onSave={handleSave}
        onDelete={() => currentSkill && setPendingDelete(currentSkill.id)}
        onAddTimeline={(payload) => currentSkill && addTimelineEvent(currentSkill.id, payload)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete skill?"
        description={`This action removes ${deleteTarget?.name ?? "this skill"} and its timeline history.`}
        confirmLabel="Delete skill"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  )
}
