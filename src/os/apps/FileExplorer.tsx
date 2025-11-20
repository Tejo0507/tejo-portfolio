import { useState } from "react"
import { Link } from "react-router-dom"
import { Folder, FileText, PlusCircle } from "lucide-react"

interface ExplorerItem {
  id: string
  label: string
  path: string
  href: string
}

const defaultItems: ExplorerItem[] = [
  { id: "projects", label: "Project Gallery", path: "Workspace/Projects", href: "/projects" },
  { id: "snippets", label: "Snippets Vault", path: "Workspace/Code", href: "/snippets" },
  { id: "materials", label: "Study Materials", path: "Workspace/Academics", href: "/study-materials" },
  { id: "timetable", label: "Timetable Lab", path: "Workspace/Academics", href: "/timetable" },
]

export default function FileExplorer() {
  const [files, setFiles] = useState(defaultItems)
  const [newFile, setNewFile] = useState("")
  const [folder, setFolder] = useState("Workspace/Custom")

  const handleAddFile = () => {
    if (!newFile.trim()) return
    setFiles((prev) => [
      { id: `${Date.now()}`, label: newFile.trim(), path: folder, href: "#" },
      ...prev,
    ])
    setNewFile("")
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="rounded-2xl border border-[#5E4B43]/30 bg-[#120906]/50 p-4">
        <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">File explorer</p>
        <p className="text-sm text-[#F7E6D4]/70">Links are shortcuts into the main portfolio. Custom entries stay local to this session.</p>
      </header>

      <section className="flex flex-1 gap-4 overflow-hidden">
        <aside className="w-52 space-y-2 rounded-2xl border border-[#5E4B43]/30 bg-[#120906]/40 p-3 text-sm text-[#F7E6D4]/80">
          {Array.from(new Set(files.map((file) => file.path))).map((path) => (
            <div key={path} className="space-y-1">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/50">
                <Folder className="h-3.5 w-3.5" /> {path.replace("Workspace/", "")}
              </p>
              <div className="pl-4 text-[#F7E6D4]/70">{files.filter((file) => file.path === path).length} items</div>
            </div>
          ))}
        </aside>

        <div className="flex-1 space-y-4 overflow-auto rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/40 p-4">
          <div className="flex flex-wrap gap-2 text-xs text-[#F7E6D4]/70">
            <label className="flex items-center gap-2 rounded-2xl border border-[#5E4B43]/40 px-3 py-2">
              <span>Folder</span>
              <input
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
                className="bg-transparent text-[#F7E6D4] outline-none"
                placeholder="Workspace/Custom"
              />
            </label>
            <label className="flex flex-1 items-center gap-2 rounded-2xl border border-[#5E4B43]/40 px-3 py-2">
              <input
                value={newFile}
                onChange={(event) => setNewFile(event.target.value)}
                className="flex-1 bg-transparent text-[#F7E6D4] outline-none"
                placeholder="notes.md"
              />
              <button type="button" onClick={handleAddFile} className="rounded-2xl border border-[#5E4B43]/40 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                <PlusCircle className="mr-1 inline h-3.5 w-3.5" /> Add
              </button>
            </label>
          </div>

          <ul className="space-y-2 text-sm">
            {files.map((file) => (
              <li key={file.id} className="rounded-2xl border border-[#5E4B43]/30 bg-[#1A100C]/70 px-3 py-2">
                <Link to={file.href} className="flex items-center justify-between">
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-[#F7E6D4]">
                      <FileText className="h-4 w-4" /> {file.label}
                    </p>
                    <p className="text-xs text-[#F7E6D4]/60">{file.path}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/50">open</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
