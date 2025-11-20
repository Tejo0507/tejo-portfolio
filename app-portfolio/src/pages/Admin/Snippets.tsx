import { useCallback, useEffect, useMemo } from "react"
import { Layers3, Star, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/Admin/AdminLayout"
import { SnippetManager } from "@/components/Admin/SnippetManager"
import { useSnippetsAdminStore } from "@/store/snippetsAdminStore"

export default function AdminSnippetsPage() {
  const snippets = useSnippetsAdminStore((state) => state.snippets)
  const bulkSelection = useSnippetsAdminStore((state) => state.bulkSelection)
  const addSnippet = useSnippetsAdminStore((state) => state.addSnippet)
  const setSelectedSnippet = useSnippetsAdminStore((state) => state.setSelectedSnippet)

  const stats = useMemo(
    () => [
      {
        label: "Snippets",
        value: snippets.length.toString(),
        delta: "+3 this month",
        icon: Layers3,
      },
      {
        label: "Favorites",
        value: snippets.filter((snippet) => snippet.favorite).length.toString(),
        delta: "Pinned",
        icon: Star,
      },
      {
        label: "Folders",
        value: new Set(snippets.map((snippet) => snippet.folderId ?? "loose")).size.toString(),
        delta: `${bulkSelection.length} selected`,
        icon: FolderOpen,
      },
    ],
    [snippets, bulkSelection.length]
  )

  const handleCreateSnippet = useCallback(() => {
    const snippet = addSnippet()
    setSelectedSnippet(snippet.id)
  }, [addSnippet, setSelectedSnippet])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName.toLowerCase()
        if (["input", "textarea"].includes(tag)) return
      }
      if (event.key.toLowerCase() === "n") {
        event.preventDefault()
        handleCreateSnippet()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleCreateSnippet])

  return (
    <AdminLayout title="Snippets vault">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D]/80 p-5 text-[#F2E4DC]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-[#F2E4DC]/60" />
            </div>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
            <p className="text-xs text-[#F2E4DC]/60">{stat.delta}</p>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button className="bg-[#5E4B43] text-[#120906]" onClick={handleCreateSnippet}>
          New snippet
        </Button>
        <p className="text-sm text-[#F2E4DC]/70">Press N anywhere to draft a snippet · Bulk select to archive together.</p>
      </div>

      <SnippetManager />
    </AdminLayout>
  )
}
