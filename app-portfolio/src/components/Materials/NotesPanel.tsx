import { useRef, useState } from "react"

interface NotesPanelProps {
  materialId: string
}

const STORAGE_KEY = "material-notes"

type NotesMap = Record<string, string>

const readNotes = (): NotesMap => {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as NotesMap) : {}
  } catch {
    return {}
  }
}

const writeNotes = (map: NotesMap) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Ignore storage quota failures
  }
}

const getInitialNote = (materialId: string) => readNotes()[materialId] ?? ""

export function NotesPanel({ materialId }: NotesPanelProps) {
  const [note, setNote] = useState(() => getInitialNote(materialId))
  const [status, setStatus] = useState<"idle" | "saved">("idle")
  const resetTimerRef = useRef<number | null>(null)

  const handleChange = (value: string) => {
    setNote(value)
    const map = readNotes()
    map[materialId] = value
    writeNotes(map)
    setStatus("saved")
    if (typeof window !== "undefined") {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
      }
      resetTimerRef.current = window.setTimeout(() => setStatus("idle"), 1500)
    }
  }

  return (
    <section className="rounded-3xl border border-[#5E4B43]/40 bg-[#2E1F1B]/70 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">Personal notes</p>
        {status === "saved" && <span className="text-xs text-[#F7E6D4]/70">Saved</span>}
      </div>
      <textarea
        value={note}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Write reminders, exam cues, or TODOs"
        className="mt-3 h-36 w-full rounded-2xl border border-[#5E4B43]/40 bg-[#1A120E] p-3 text-sm text-[#F7E6D4] placeholder:text-[#F7E6D4]/40 focus:border-[#F7E6D4] focus:outline-none"
      />
    </section>
  )
}
