import { useCallback, useEffect, useMemo, useState } from "react"
import { Sparkles, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminLayout } from "@/components/Admin/AdminLayout"
import { AiToolEditor } from "@/components/Admin/AiToolEditor"
import { ConfirmDialog } from "@/components/Admin/ConfirmDialog"
import { useAiLabAdminStore } from "@/store/aiLabAdminStore"

export default function AdminAiLabPage() {
  const tools = useAiLabAdminStore((state) => state.tools)
  const selectedId = useAiLabAdminStore((state) => state.selectedId)
  const addTool = useAiLabAdminStore((state) => state.addTool)
  const updateTool = useAiLabAdminStore((state) => state.updateTool)
  const deleteTool = useAiLabAdminStore((state) => state.deleteTool)
  const toggleVisibility = useAiLabAdminStore((state) => state.toggleVisibility)
  const addPrompt = useAiLabAdminStore((state) => state.addPrompt)
  const removePrompt = useAiLabAdminStore((state) => state.removePrompt)
  const setSelected = useAiLabAdminStore((state) => state.setSelected)
  const drawerOpen = useAiLabAdminStore((state) => state.drawerOpen)
  const toggleDrawer = useAiLabAdminStore((state) => state.toggleDrawer)

  const [search, setSearch] = useState("")
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const filteredTools = useMemo(() => {
    const query = search.toLowerCase()
    if (!query) return tools
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        tool.category.toLowerCase().includes(query)
    )
  }, [tools, search])

  const currentTool = useMemo(() => tools.find((tool) => tool.id === selectedId) ?? null, [tools, selectedId])
  const deleteTarget = useMemo(() => tools.find((tool) => tool.id === pendingDelete) ?? null, [tools, pendingDelete])

  const handleCreate = useCallback(() => {
    addTool()
  }, [addTool])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName.toLowerCase()
        if (["input", "textarea"].includes(tag)) return
      }
      if (event.key.toLowerCase() === "n") {
        event.preventDefault()
        handleCreate()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleCreate])

  useEffect(() => {
    const handler = () => {
      if (!currentTool && tools.length) {
        setSelected(tools[0].id)
      }
      toggleDrawer(true)
    }
    document.addEventListener("admin-ai-prompt", handler)
    return () => document.removeEventListener("admin-ai-prompt", handler)
  }, [currentTool, tools, setSelected, toggleDrawer])

  const stats = useMemo(
    () => [
      { label: "Tools", value: tools.length.toString(), meta: "+1 prototype" },
      { label: "Visible", value: tools.filter((tool) => tool.visible).length.toString(), meta: "Shown on site" },
      { label: "Prompts", value: tools.reduce((sum, tool) => sum + tool.examplePrompts.length, 0).toString(), meta: "Reusable" },
    ],
    [tools]
  )

  return (
    <AdminLayout title="AI Lab">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D]/80 p-5 text-[#F2E4DC]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
            <p className="text-xs text-[#F2E4DC]/60">{stat.meta}</p>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button className="bg-[#5E4B43] text-[#120906]" onClick={handleCreate}>
          <Sparkles className="mr-2 h-4 w-4" /> New tool
        </Button>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tools or tags"
          className="max-w-xs"
        />
        <p className="text-sm text-[#F2E4DC]/60">Visibility toggles sync live with the public AI lab.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {filteredTools.map((tool) => (
          <article
            key={tool.id}
            className="rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/80 p-5 text-[#F2E4DC]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{tool.category}</p>
                <h3 className="mt-1 text-xl font-semibold">{tool.name}</h3>
                <p className="text-sm text-[#F2E4DC]/70">{tool.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={tool.visible ? "Hide tool" : "Publish tool"}
                className="text-[#F2E4DC]/70"
                onClick={() => toggleVisibility(tool.id)}
              >
                {tool.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-[#F2E4DC]/50">
              {tool.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#5E4B43]/30 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-[#5E4B43]/40 text-[#F2E4DC]"
                onClick={() => {
                  setSelected(tool.id)
                  toggleDrawer(true)
                }}
              >
                Edit tool
              </Button>
              <Button
                variant="ghost"
                className="text-rose-300"
                onClick={() => setPendingDelete(tool.id)}
              >
                Delete
              </Button>
            </div>
          </article>
        ))}
      </section>

      <AiToolEditor
        key={currentTool?.id ?? "empty"}
        tool={currentTool}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onSave={(data) => currentTool && updateTool(currentTool.id, data)}
        onDelete={() => currentTool && setPendingDelete(currentTool.id)}
        onAddPrompt={(prompt) => currentTool && addPrompt(currentTool.id, prompt)}
        onRemovePrompt={(prompt) => currentTool && removePrompt(currentTool.id, prompt)}
        onToggleVisibility={() => currentTool && toggleVisibility(currentTool.id)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete AI tool?"
        description={`This will remove ${deleteTarget?.name ?? "the tool"} from the lab.`}
        confirmLabel="Delete tool"
        destructive
        onConfirm={() => {
          if (!pendingDelete) return
          deleteTool(pendingDelete)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  )
}
