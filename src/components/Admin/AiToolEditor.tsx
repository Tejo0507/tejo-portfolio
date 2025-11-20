import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { AdminAiTool } from "@/data/sampleAiTools"

interface AiToolEditorProps {
  tool: AdminAiTool | null
  open: boolean
  onClose: () => void
  onSave: (data: Partial<AdminAiTool>) => void
  onDelete?: () => void
  onAddPrompt?: (prompt: string) => void
  onRemovePrompt?: (prompt: string) => void
  onToggleVisibility?: () => void
}

export function AiToolEditor({ tool, open, onClose, onSave, onDelete, onAddPrompt, onRemovePrompt, onToggleVisibility }: AiToolEditorProps) {
  const prefersReducedMotion = useReducedMotion()
  const [name, setName] = useState(() => tool?.name ?? "")
  const [description, setDescription] = useState(() => tool?.description ?? "")
  const [tags, setTags] = useState(() => (tool ? tool.tags.join(", ") : ""))
  const [icon, setIcon] = useState(() => tool?.icon ?? "Sparkles")
  const [category, setCategory] = useState(() => tool?.category ?? "Utility")
  const [promptDraft, setPromptDraft] = useState("")

  const handleSave = useCallback(() => {
    if (!tool) return
    onSave({
      name,
      description,
      icon,
      category,
      tags: tags
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    })
  }, [tool, name, description, icon, category, tags, onSave])

  const handleAddPrompt = () => {
    if (!promptDraft.trim()) return
    onAddPrompt?.(promptDraft.trim())
    setPromptDraft("")
  }

  useEffect(() => {
    if (!open || !tool) return
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
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
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, tool, handleSave, onClose, onDelete])

  return (
    <AnimatePresence>
      {open && tool ? (
        <motion.aside
          className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-[#5E4B43]/30 bg-[#120906] p-6 text-[#F2E4DC]"
          initial={{ x: prefersReducedMotion ? 0 : 420 }}
          animate={{ x: 0 }}
          exit={{ x: prefersReducedMotion ? 0 : 420 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">AI tool</p>
              <h2 className="text-xl font-semibold">{tool.name}</h2>
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
              <span>Description</span>
              <Textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Category</span>
                <Input value={category} onChange={(event) => setCategory(event.target.value)} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Icon (lucide name)</span>
                <Input value={icon} onChange={(event) => setIcon(event.target.value)} />
              </label>
            </div>
            <label className="space-y-2 text-sm">
              <span>Tags</span>
              <Input value={tags} onChange={(event) => setTags(event.target.value)} />
            </label>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-[#5E4B43]/30 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Prompt examples</p>
              <Button variant="ghost" size="sm" className="text-[#F2E4DC]/70" onClick={onToggleVisibility}>
                {tool.visible ? "Hide tool" : "Publish"}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input value={promptDraft} onChange={(event) => setPromptDraft(event.target.value)} placeholder="Ex: Outline a 4-act journey" />
              <Button className="bg-[#5E4B43] text-[#120906]" onClick={handleAddPrompt}>
                Add
              </Button>
            </div>
            <ul className="space-y-2 text-sm text-[#F2E4DC]/80">
              {tool.examplePrompts.map((prompt) => (
                <li key={prompt} className="flex items-center justify-between rounded-2xl border border-[#5E4B43]/20 px-3 py-2">
                  <span>{prompt}</span>
                  <Button variant="ghost" size="icon" className="text-rose-300" onClick={() => onRemovePrompt?.(prompt)}>
                    ×
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="bg-[#5E4B43] text-[#120906]" onClick={handleSave}>
              Save tool
            </Button>
            {onDelete ? (
              <Button variant="outline" className="border-rose-500/40 text-rose-200" onClick={onDelete}>
                Remove tool
              </Button>
            ) : null}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
