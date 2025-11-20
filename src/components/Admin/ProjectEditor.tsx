import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { AdminProject } from "@/data/sampleProjects"

interface ProjectEditorProps {
  project: AdminProject | null
  open: boolean
  onClose: () => void
  onSave: (data: Partial<AdminProject>) => void
  onDelete?: () => void
  onUploadCover?: (image: string) => void
}

export function ProjectEditor({ project, open, onClose, onSave, onDelete, onUploadCover }: ProjectEditorProps) {
  const [title, setTitle] = useState(() => project?.title ?? "")
  const [description, setDescription] = useState(() => project?.description ?? "")
  const [tags, setTags] = useState(() => (project ? project.tags.join(", ") : ""))
  const [tech, setTech] = useState(() => (project ? project.tech.join(", ") : ""))
  const [repoUrl, setRepoUrl] = useState(() => project?.repoUrl ?? "")
  const [demoUrl, setDemoUrl] = useState(() => project?.demoUrl ?? "")
  const [featured, setFeatured] = useState(() => project?.featured ?? false)
  const [visibility, setVisibility] = useState<AdminProject["visibility"]>(() => project?.visibility ?? "published")
  const [image, setImage] = useState(() => project?.image ?? "")
  const prefersReducedMotion = useReducedMotion()

  const handleSave = useCallback(() => {
    if (!project) return
    onSave({
      title,
      description,
      repoUrl,
      demoUrl,
      featured,
      visibility,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      tech: tech
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    })
  }, [project, title, description, repoUrl, demoUrl, featured, visibility, tags, tech, onSave])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setImage(base64)
      onUploadCover?.(base64)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault()
        handleSave()
      }
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
      }
      if (event.key === "Delete" && onDelete) {
        event.preventDefault()
        onDelete()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, handleSave, onDelete, onClose])

  return (
    <AnimatePresence>
      {open && project ? (
        <motion.aside
          className="fixed inset-y-0 right-0 z-40 w-full max-w-xl border-l border-[#5E4B43]/30 bg-[#120906] p-6 text-[#F2E4DC] shadow-2xl"
          initial={{ x: prefersReducedMotion ? 0 : 500 }}
          animate={{ x: 0 }}
          exit={{ x: prefersReducedMotion ? 0 : 500 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Editor</p>
              <h2 className="text-2xl font-semibold">{project.title}</h2>
            </div>
            <Button variant="outline" className="border-[#5E4B43]/40 text-[#F2E4DC]" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="mt-6 space-y-5">
            <label className="space-y-2 text-sm">
              <span>Title</span>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label className="space-y-2 text-sm">
              <span>Description</span>
              <Textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Tags (comma separated)</span>
                <Input value={tags} onChange={(event) => setTags(event.target.value)} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Tech stack</span>
                <Input value={tech} onChange={(event) => setTech(event.target.value)} />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Repository URL</span>
                <Input value={repoUrl} onChange={(event) => setRepoUrl(event.target.value)} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Demo URL</span>
                <Input value={demoUrl} onChange={(event) => setDemoUrl(event.target.value)} />
              </label>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-[#5E4B43]/40 p-4">
              <div>
                <p className="text-sm font-medium">Featured</p>
                <p className="text-xs text-[#F2E4DC]/70">Surface on the public homepage</p>
              </div>
              <Switch checked={featured} onClick={() => setFeatured((value) => !value)} aria-checked={featured} />
            </div>

            <label className="space-y-2 text-sm">
              <span>Visibility</span>
              <Select value={visibility} onChange={(event) => setVisibility(event.target.value as AdminProject["visibility"]) }>
                <option value="published">Published</option>
                <option value="unlisted">Unlisted</option>
              </Select>
            </label>

            <div className="space-y-2 text-sm">
              <span>Cover image</span>
              {image ? <img src={image} alt="Project cover" className="h-40 w-full rounded-2xl object-cover" /> : null}
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="bg-[#5E4B43] text-[#120906]" onClick={handleSave}>
              Save changes
            </Button>
            {onDelete ? (
              <Button variant="outline" className="border-rose-500/40 text-rose-200" onClick={onDelete}>
                Delete
              </Button>
            ) : null}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
