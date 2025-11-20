import { useEffect, useMemo, useState } from "react"
import { marked } from "marked"
import DOMPurify from "dompurify"
import { Plus, Search, Tag } from "lucide-react"

interface NoteEntry {
  id: string
  title: string
  content: string
  tags: string[]
  updatedAt: string
}

const STORAGE_KEY = "mini-os-notes"

const defaultNotes: NoteEntry[] = [
  {
    id: "welcome-note",
    title: "Mini OS scratchpad",
    content: "## Welcome\n\nUse Markdown to plan study sessions or jot backlog items.",
    tags: ["inbox"],
    updatedAt: new Date().toISOString(),
  },
]

const loadNotes = (): NoteEntry[] => {
  if (typeof window === "undefined") return defaultNotes
  try {
    const payload = window.localStorage.getItem(STORAGE_KEY)
    return payload ? (JSON.parse(payload) as NoteEntry[]) : defaultNotes
  } catch {
    return defaultNotes
  }
}

const persistNotes = (notes: NoteEntry[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    /* ignore */
  }
}

export default function NotesApp() {
  const [notes, setNotes] = useState<NoteEntry[]>(() => loadNotes())
  const [search, setSearch] = useState("")
  const [activeId, setActiveId] = useState(notes[0]?.id ?? "")
  const [tagInput, setTagInput] = useState("")

  const activeNote = notes.find((note) => note.id === activeId) ?? null
  const filteredNotes = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return notes
    return notes.filter((note) =>
      note.title.toLowerCase().includes(needle) || note.tags.some((tag) => tag.toLowerCase().includes(needle))
    )
  }, [notes, search])

  useEffect(() => {
    persistNotes(notes)
  }, [notes])

  const handleCreateNote = () => {
    const timestamp = new Date().toISOString()
    const entry: NoteEntry = {
      id: `note-${timestamp}`,
      title: `Untitled ${notes.length + 1}`,
      content: "",
      tags: [],
      updatedAt: timestamp,
    }
    setNotes([entry, ...notes])
    setActiveId(entry.id)
  }

  const updateActiveNote = (changes: Partial<NoteEntry>) => {
    if (!activeNote) return
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeNote.id
          ? { ...note, ...changes, updatedAt: new Date().toISOString() }
          : note
      )
    )
  }

  const previewHtml = useMemo(() => {
    const parsed = marked.parse(activeNote?.content ?? "")
    const html = typeof parsed === "string" ? parsed : ""
    return DOMPurify.sanitize(html)
  }, [activeNote?.content])

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (!tag || !activeNote) return
    if (activeNote.tags.includes(tag)) {
      setTagInput("")
      return
    }
    updateActiveNote({ tags: [...activeNote.tags, tag] })
    setTagInput("")
  }

  return (
    <div className="flex h-full gap-4">
      <aside className="flex w-56 flex-col rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/50 p-3 text-sm text-[#F7E6D4]/80">
        <div className="flex items-center gap-2 rounded-2xl border border-[#5E4B43]/30 px-2 py-1">
          <Search className="h-4 w-4" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-[#F7E6D4] outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleCreateNote}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#5E4B43]/40 px-3 py-2 text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/70"
        >
          <Plus className="h-4 w-4" /> New note
        </button>
        <ul className="mt-4 space-y-2 overflow-auto">
          {filteredNotes.map((note) => (
            <li key={note.id}>
              <button
                type="button"
                onClick={() => setActiveId(note.id)}
                className={`w-full rounded-2xl border px-3 py-2 text-left ${
                  note.id === activeId
                    ? "border-[#F7E6D4]/70 bg-[#5E4B43]/30 text-[#F7E6D4]"
                    : "border-[#5E4B43]/30 text-[#F7E6D4]/70"
                }`}
              >
                <p className="font-semibold">{note.title}</p>
                <p className="text-xs text-[#F7E6D4]/60">{new Date(note.updatedAt).toLocaleString()}</p>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 space-y-3 overflow-hidden rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/40 p-4">
        {activeNote ? (
          <>
            <input
              value={activeNote.title}
              onChange={(event) => updateActiveNote({ title: event.target.value })}
              className="w-full rounded-2xl border border-transparent bg-transparent text-2xl font-semibold text-[#F7E6D4] outline-none"
            />
            <div className="flex flex-wrap items-center gap-2">
              {activeNote.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-[#5E4B43]/40 px-3 py-1 text-xs">
                  <Tag className="h-3 w-3" /> {tag}
                </span>
              ))}
              <div className="flex items-center gap-2 rounded-2xl border border-[#5E4B43]/30 px-2 py-1 text-xs">
                <input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  placeholder="add tag"
                  className="w-24 bg-transparent text-[#F7E6D4] outline-none"
                />
                <button type="button" onClick={handleAddTag} className="rounded-xl border border-[#5E4B43]/30 px-2 py-0.5">
                  add
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <textarea
                value={activeNote.content}
                onChange={(event) => updateActiveNote({ content: event.target.value })}
                className="h-64 rounded-3xl border border-[#5E4B43]/30 bg-[#0B0503]/70 p-4 text-sm text-[#F7E6D4] focus:border-[#F7E6D4] focus:outline-none"
                placeholder="### Markdown lives here"
              />
              <article
                className="h-64 overflow-auto rounded-3xl border border-[#5E4B43]/30 bg-[#0B0503]/40 p-4 text-sm text-[#F7E6D4]/80"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-[#F7E6D4]/70">Select or create a note.</p>
        )}
      </div>
    </div>
  )
}
