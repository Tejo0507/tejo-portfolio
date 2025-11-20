import { useEffect, useMemo, useRef, useState } from "react"
import { Upload, Download, Trash2, FolderPlus, CheckSquare, FilePenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSnippetsAdminStore } from "@/store/snippetsAdminStore"
import { exportState, importState } from "@/utils/localBackup"
import type { Snippet } from "@/types/snippet"

export function SnippetManager() {
  const {
    folders,
    snippets,
    selectedFolderId,
    selectedSnippetId,
    bulkSelection,
    setSelectedFolder,
    setSelectedSnippet,
    toggleBulkSelection,
    clearBulk,
    addFolder,
    renameFolder,
    deleteFolder,
    updateSnippet,
    deleteSnippet,
    bulkDelete,
    addVersion,
    deleteVersion,
    resetStore,
    importSnapshot,
    exportSnapshot,
  } = useSnippetsAdminStore()

  const [folderName, setFolderName] = useState("")
  const [titleDraft, setTitleDraft] = useState("")
  const [descriptionDraft, setDescriptionDraft] = useState("")
  const [tagDraft, setTagDraft] = useState("")
  const [versionNote, setVersionNote] = useState("")
  const importInputRef = useRef<HTMLInputElement | null>(null)

  const filteredSnippets = useMemo(() => {
    if (!selectedFolderId) return snippets
    return snippets.filter((snippet) => snippet.folderId === selectedFolderId)
  }, [snippets, selectedFolderId])

  const currentSnippet = snippets.find((snippet) => snippet.id === selectedSnippetId) ?? null

  const handleSelectSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet.id)
    setTitleDraft(snippet.title)
    setDescriptionDraft(snippet.description)
    setTagDraft(snippet.tags.join(", "))
  }

  const handleSnippetSave = () => {
    if (!currentSnippet) return
    updateSnippet(currentSnippet.id, {
      title: titleDraft,
      description: descriptionDraft,
      tags: tagDraft
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    })
  }

  const handleExport = () => {
    const snapshot = exportSnapshot()
    exportState(snapshot)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const data = await importState<{ folders: typeof folders; snippets: typeof snippets }>(file)
    importSnapshot(data.folders, data.snippets)
    event.target.value = ""
  }

  useEffect(() => {
    const handler = () => importInputRef.current?.click()
    document.addEventListener("admin-snippet-import", handler)
    return () => document.removeEventListener("admin-snippet-import", handler)
  }, [])

  const handleAddFolder = () => {
    if (!folderName.trim()) return
    addFolder({ name: folderName.trim(), parentId: null })
    setFolderName("")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <section className="space-y-4 rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#F2E4DC]">Folders</h3>
          <Button size="icon" variant="ghost" className="text-[#F2E4DC]" aria-label="Add folder" onClick={handleAddFolder}>
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
        <Input value={folderName} onChange={(event) => setFolderName(event.target.value)} placeholder="Folder name" />
        <ul className="space-y-2 text-sm">
          <li>
            <button
              type="button"
              className={`w-full rounded-2xl px-3 py-2 text-left ${!selectedFolderId ? "bg-[#5E4B43] text-[#120906]" : "text-[#F2E4DC]/70"}`}
              onClick={() => setSelectedFolder(null)}
            >
              All snippets
            </button>
          </li>
          {folders.map((folder) => (
            <li key={folder.id} className="flex items-center gap-2">
              <button
                type="button"
                className={`flex-1 rounded-2xl px-3 py-2 text-left ${selectedFolderId === folder.id ? "bg-[#5E4B43] text-[#120906]" : "text-[#F2E4DC]/80"}`}
                onClick={() => setSelectedFolder(folder.id)}
              >
                {folder.name}
              </button>
              <Button
                size="icon"
                variant="ghost"
                className="text-[#F2E4DC]/70"
                onClick={() => {
                  const next = prompt("Rename folder", folder.name)
                  if (!next) return
                  renameFolder(folder.id, next)
                }}
              >
                ✏️
              </Button>
              <Button size="icon" variant="ghost" className="text-rose-300" onClick={() => deleteFolder(folder.id)}>
                ×
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button className="bg-[#5E4B43] text-[#120906]" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <label className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-[#5E4B43]/50 px-4 py-2 text-sm text-[#F2E4DC]/80">
            <Upload className="h-4 w-4" /> Import
            <input ref={importInputRef} type="file" accept="application/json" className="sr-only" onChange={handleImport} />
          </label>
          <Button variant="outline" className="border-rose-400/40 text-rose-200" onClick={bulkDelete} disabled={!bulkSelection.length}>
            <Trash2 className="mr-2 h-4 w-4" /> Bulk delete
          </Button>
          <Button variant="ghost" className="text-[#F2E4DC]/70" onClick={resetStore}>
            Reset store
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <button
              type="button"
              key={snippet.id}
              onClick={() => handleSelectSnippet(snippet)}
              className={`rounded-3xl border px-4 py-4 text-left transition ${selectedSnippetId === snippet.id ? "border-[#5E4B43] bg-[#5E4B43]/10" : "border-[#5E4B43]/30 bg-[#120906]/80"}`}
            >
              <div className="flex items-center justify-between text-xs text-[#F2E4DC]/70">
                <span>{snippet.language.toUpperCase()}</span>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#5E4B43]/40 bg-transparent"
                    checked={bulkSelection.includes(snippet.id)}
                    onChange={() => toggleBulkSelection(snippet.id)}
                  />
                  <CheckSquare className="h-4 w-4" />
                </label>
              </div>
              <p className="mt-2 text-lg font-semibold text-[#F2E4DC]">{snippet.title}</p>
              <p className="text-sm text-[#F2E4DC]/70">{snippet.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-widest text-[#F2E4DC]/50">
                {snippet.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#5E4B43]/30 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {currentSnippet ? (
          <div className="rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#F2E4DC]">Edit snippet</h3>
              <Button variant="outline" className="border-rose-400/40 text-rose-200" onClick={() => deleteSnippet(currentSnippet.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Title</span>
                <Input value={titleDraft} onChange={(event) => setTitleDraft(event.target.value)} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Tags</span>
                <Input value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} />
              </label>
            </div>
            <label className="mt-4 block space-y-2 text-sm">
              <span>Description</span>
              <Textarea rows={3} value={descriptionDraft} onChange={(event) => setDescriptionDraft(event.target.value)} />
            </label>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button className="bg-[#5E4B43] text-[#120906]" onClick={handleSnippetSave}>
                <FilePenLine className="mr-2 h-4 w-4" /> Save metadata
              </Button>
              <Button variant="ghost" className="text-[#F2E4DC]/60" onClick={clearBulk}>
                Clear selection
              </Button>
            </div>

            <div className="mt-6 rounded-2xl border border-[#5E4B43]/30 p-4">
              <p className="text-sm font-semibold text-[#F2E4DC]">Versions</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Input
                  value={versionNote}
                  onChange={(event) => setVersionNote(event.target.value)}
                  placeholder="Version note"
                  className="flex-1"
                />
                <Button
                  className="bg-[#5E4B43] text-[#120906]"
                  onClick={() => {
                    if (!versionNote.trim()) return
                    addVersion(currentSnippet.id, { code: currentSnippet.code, note: versionNote.trim() })
                    setVersionNote("")
                  }}
                >
                  Add version
                </Button>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-[#F2E4DC]/80">
                {currentSnippet.versions.map((version) => (
                  <li key={version.id} className="flex items-center justify-between rounded-2xl border border-[#5E4B43]/20 px-3 py-2">
                    <span>
                      {new Date(version.createdAt).toLocaleString()} — {version.note ?? "Untitled"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-rose-300"
                      onClick={() => deleteVersion(currentSnippet.id, version.id)}
                      aria-label="Delete version"
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}
