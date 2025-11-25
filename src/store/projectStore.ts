import { create } from "zustand"
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware"
import type { ProjectRecord } from "@/data/projects"
import { projects as seedProjects } from "@/data/projects"
import type { AdminProject } from "@/data/sampleProjects"
import { sampleProjects } from "@/data/sampleProjects"
import { reorderList } from "@/utils/reorder"
import { addActivity } from "@/utils/activityLog"
import { generateId, timestampNow } from "@/utils/generateId"

export interface ProjectFilters {
  tech: string[]
  yearRange: [number, number]
  search: string
}

interface ProjectStoreState {
  projects: ProjectRecord[]
  filters: ProjectFilters
  compareList: string[]
  devMode: boolean
  selectedProjectId: string | null
  setFilters: (filters: Partial<ProjectFilters>) => void
  toggleCompare: (id: string) => void
  setDevMode: (value: boolean) => void
  selectProject: (id: string | null) => void
  addProject: (project: ProjectRecord) => void
  updateProject: (id: string, data: Partial<ProjectRecord>) => void
}

const years = seedProjects.map((project) => project.year)
const initialFilters: ProjectFilters = {
  tech: [],
  yearRange: [Math.min(...years), Math.max(...years)],
  search: "",
}

export const useProjectStore = create<ProjectStoreState>((set) => ({
  projects: seedProjects,
  filters: initialFilters,
  compareList: [],
  devMode: false,
  selectedProjectId: null,
  setFilters: (next) =>
    set((state) => ({
      filters: { ...state.filters, ...next },
    })),
  toggleCompare: (id) =>
    set((state) => {
      const exists = state.compareList.includes(id)
      if (exists) {
        return { compareList: state.compareList.filter((projectId) => projectId !== id) }
      }
      if (state.compareList.length >= 3) {
        return { compareList: state.compareList }
      }
      return { compareList: [...state.compareList, id] }
    }),
  setDevMode: (value) => set({ devMode: value }),
  selectProject: (id) => set({ selectedProjectId: id }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, data) =>
    set((state) => ({
      projects: state.projects.map((project) => (project.id === id ? { ...project, ...data } : project)),
    })),
}))

// --- Admin Project Store ---------------------------------------------------

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const projectStorage = createJSONStorage<AdminProjectStoreState>(() => (typeof window !== "undefined" ? localStorage : memoryStorage))

export interface AdminProjectStoreState {
  projects: AdminProject[]
  selectedId: string | null
  drawerOpen: boolean
  filter: string
  createProject: (data?: Partial<AdminProject>) => AdminProject
  updateProject: (id: string, data: Partial<AdminProject>) => void
  deleteProject: (id: string) => void
  reorderProjects: (start: number, end: number) => void
  toggleVisibility: (id: string) => void
  setFeatured: (id: string, featured: boolean) => void
  selectProject: (id: string | null) => void
  toggleDrawer: (open: boolean) => void
  updateCover: (id: string, image: string) => void
  setFilter: (value: string) => void
  importProjects: (data: AdminProject[]) => void
}

export const useAdminProjectStore = create(
  persist<AdminProjectStoreState>(
  (set) => ({
      projects: sampleProjects,
      selectedId: null,
      drawerOpen: false,
      filter: "",
      createProject: (data) => {
        const project: AdminProject = {
          id: data?.id ?? generateId("proj"),
          title: data?.title ?? "Untitled project",
          description: data?.description ?? "Describe the project story, outcomes, and craft.",
          tags: data?.tags ?? ["concept"],
          tech: data?.tech ?? ["React"],
          image: data?.image ?? "/images/projects/placeholder.jpg",
          repoUrl: data?.repoUrl ?? "https://github.com/tejo0507",
          demoUrl: data?.demoUrl ?? "https://tejo.dev",
          createdAt: data?.createdAt ?? timestampNow(),
          updatedAt: timestampNow(),
          featured: data?.featured ?? false,
          visibility: data?.visibility ?? "published",
        }

        set((state) => ({ projects: [project, ...state.projects], selectedId: project.id, drawerOpen: true }))
        addActivity(project.title, "Created project", "project")
        return project
      },
      updateProject: (id, data) =>
        set((state) => {
          const target = state.projects.find((project) => project.id === id)
          if (!target) return state
          addActivity(target.title, "Updated project", "project")
          return {
            projects: state.projects.map((project) =>
              project.id === id ? { ...project, ...data, updatedAt: timestampNow() } : project
            ),
          }
        }),
      deleteProject: (id) =>
        set((state) => {
          const target = state.projects.find((project) => project.id === id)
          if (!target) return state
          addActivity(target.title, "Deleted project", "project")
          return {
            projects: state.projects.filter((project) => project.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId,
          }
        }),
      reorderProjects: (start, end) =>
        set((state) => {
          const ordered = reorderList(state.projects, start, end)
          addActivity("Projects", "Reordered collection", "project")
          return { projects: ordered }
        }),
      toggleVisibility: (id) =>
        set((state) => {
          const target = state.projects.find((project) => project.id === id)
          if (!target) return state
          addActivity(target.title, "Toggled visibility", "project")
          return {
            projects: state.projects.map((project) =>
              project.id === id
                ? { ...project, visibility: project.visibility === "published" ? "unlisted" : "published" }
                : project
            ),
          }
        }),
      setFeatured: (id, featured) =>
        set((state) => {
          const target = state.projects.find((project) => project.id === id)
          if (!target) return state
          addActivity(target.title, featured ? "Marked featured" : "Removed featured", "project")
          return {
            projects: state.projects.map((project) => (project.id === id ? { ...project, featured } : project)),
          }
        }),
      selectProject: (id) => set({ selectedId: id }),
      toggleDrawer: (open) => set({ drawerOpen: open }),
      updateCover: (id, image) =>
        set((state) => ({
          projects: state.projects.map((project) => (project.id === id ? { ...project, image } : project)),
        })),
      setFilter: (value) => set({ filter: value }),
      importProjects: (data) => {
        set({ projects: data })
        addActivity("Projects", "Imported collection", "project")
      },
    }),
    {
      name: "portfolio-admin-projects",
      storage: projectStorage,
      skipHydration: typeof window === "undefined",
    }
  )
)

// Fallback Context example (if Zustand becomes unavailable):
// const ProjectStoreContext = createContext<ProjectStoreState | null>(null)
// export function useProjectStoreFallback() {
//   const context = useContext(ProjectStoreContext)
//   if (!context) {
//     throw new Error("ProjectStoreContext missing")
//   }
//   return context
// }

// const AdminProjectStoreContext = createContext<AdminProjectStoreState | null>(null)
// export function useAdminProjectStoreFallback() {
//   const context = useContext(AdminProjectStoreContext)
//   if (!context) throw new Error("AdminProjectStoreContext missing")
//   return context
// }