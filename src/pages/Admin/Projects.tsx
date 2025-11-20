import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { AdminLayout } from "@/components/Admin/AdminLayout"
import { ProjectEditor } from "@/components/Admin/ProjectEditor"
import { useAdminProjectStore } from "@/store/projectStore"
import type { AdminProject } from "@/data/sampleProjects"
import { cn } from "@/utils"

export default function AdminProjectsPage() {
  const projects = useAdminProjectStore((state) => state.projects)
  const selectedId = useAdminProjectStore((state) => state.selectedId)
  const selectProject = useAdminProjectStore((state) => state.selectProject)
  const createProject = useAdminProjectStore((state) => state.createProject)
  const updateProject = useAdminProjectStore((state) => state.updateProject)
  const deleteProject = useAdminProjectStore((state) => state.deleteProject)
  const reorderProjects = useAdminProjectStore((state) => state.reorderProjects)
  const toggleVisibility = useAdminProjectStore((state) => state.toggleVisibility)
  const setFeatured = useAdminProjectStore((state) => state.setFeatured)
  const drawerOpen = useAdminProjectStore((state) => state.drawerOpen)
  const toggleDrawer = useAdminProjectStore((state) => state.toggleDrawer)
  const updateCover = useAdminProjectStore((state) => state.updateCover)
  const setFilter = useAdminProjectStore((state) => state.setFilter)

  const currentProject = projects.find((project) => project.id === selectedId) ?? null

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName.toLowerCase()
        if (["input", "textarea"].includes(tag)) return
      }
      if (event.key.toLowerCase() === "n") {
        event.preventDefault()
        const project = createProject()
        selectProject(project.id)
        toggleDrawer(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [createProject, selectProject, toggleDrawer])

  const handleSave = (data: Partial<AdminProject>) => {
    if (!currentProject) return
    updateProject(currentProject.id, data)
  }

  const moveProject = (index: number, delta: number) => {
    const nextIndex = index + delta
    if (nextIndex < 0 || nextIndex >= projects.length) return
    reorderProjects(index, nextIndex)
  }

  return (
    <AdminLayout title="Projects">
      <div className="flex flex-wrap items-center gap-4">
        <Button
          className="bg-[#5E4B43] text-[#120906]"
          onClick={() => {
            const project = createProject()
            selectProject(project.id)
            toggleDrawer(true)
          }}
        >
          Add project
        </Button>
        <Input placeholder="Filter by tag" className="max-w-xs" onChange={(event) => setFilter(event.target.value)} />
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <article key={project.id} className={cn(
            "rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D]/80 p-5 text-[#F2E4DC] transition",
            selectedId === project.id && "border-[#5E4B43] shadow-lg"
          )}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{project.visibility}</p>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-sm text-[#F2E4DC]/70">{project.description}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="ghost" className="text-[#F2E4DC]/70" onClick={() => moveProject(index, -1)}>
                  ↑
                </Button>
                <Button size="sm" variant="ghost" className="text-[#F2E4DC]/70" onClick={() => moveProject(index, 1)}>
                  ↓
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/50">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#5E4B43]/30 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" className="border-[#5E4B43]/40 text-[#F2E4DC]" onClick={() => { selectProject(project.id); toggleDrawer(true) }}>
                Edit
              </Button>
              <Button variant="ghost" className="text-[#F2E4DC]/70" onClick={() => toggleVisibility(project.id)}>
                {project.visibility === "published" ? "Unlist" : "Publish"}
              </Button>
              <div className="flex items-center gap-2 text-xs">
                <span>Featured</span>
                <Switch checked={project.featured} onClick={() => setFeatured(project.id, !project.featured)} aria-checked={project.featured} />
              </div>
            </div>
          </article>
        ))}
      </section>

      <ProjectEditor
        key={currentProject?.id ?? "empty"}
        project={currentProject}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onSave={handleSave}
        onDelete={() => currentProject && deleteProject(currentProject.id)}
        onUploadCover={(image) => currentProject && updateCover(currentProject.id, image)}
      />
    </AdminLayout>
  )
}
