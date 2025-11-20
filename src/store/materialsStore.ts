import { create } from "zustand"
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware"
import { sampleMaterials } from "@/data/sampleMaterials"
import type {
  Material,
  MaterialFilters,
  MaterialVersion,
  NewMaterialInput,
  NewMaterialVersionInput,
  SemesterCollection,
} from "@/types/materials"
import { detectFileTypeFromUrl, parseDriveLink } from "@/utils/driveUtils"

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

// Safe storage wrapper to avoid JSON parse crashes producing a blank screen
const safeStorage: StateStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null
    try {
      return window.localStorage.getItem(name)
    } catch (err) {
      console.warn("[materialsStore] getItem failed, returning null", err)
      return null
    }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(name, value)
    } catch (err) {
      console.warn("[materialsStore] setItem failed", err)
    }
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.removeItem(name)
    } catch (err) {
      console.warn("[materialsStore] removeItem failed", err)
    }
  },
}

const storageFactory = () => (typeof window === "undefined" ? memoryStorage : safeStorage)

const defaultFilters: MaterialFilters = {
  search: "",
  subject: null,
  semester: null,
  types: [],
  tags: [],
  showArchived: false,
}

const ensureArray = <T>(value: unknown, fallback: T[]): T[] => (Array.isArray(value) ? (value as T[]) : fallback)
const ensureMaterials = (value: unknown, fallback: Material[]): Material[] => (Array.isArray(value) ? (value as Material[]) : fallback)

export interface MaterialsStoreState {
  materials: Material[]
  filters: MaterialFilters
  bookmarks: string[]
  selectedMaterialId: string | null
  semesterCollections: SemesterCollection[]
  addMaterial: (input: NewMaterialInput) => Material
  addVersion: (materialId: string, version: NewMaterialVersionInput) => MaterialVersion | null
  archiveMaterial: (materialId: string, archived?: boolean) => void
  archiveVersion: (materialId: string, versionId: string, archived?: boolean) => void
  setFilters: (filters: Partial<MaterialFilters>) => void
  clearFilters: () => void
  search: (query: string) => void
  toggleBookmark: (materialId: string) => void
  setSelectedMaterial: (materialId: string | null) => void
  addSemesterCollection: (collection: Omit<SemesterCollection, "id">) => SemesterCollection
  updateMaterialMetadata: (materialId: string, data: Partial<Material>) => void
}

const randomId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const useMaterialsStore = create<MaterialsStoreState>()(
  persist(
    (set) => ({
      materials: sampleMaterials,
      filters: defaultFilters,
      bookmarks: [],
      selectedMaterialId: null,
      semesterCollections: [
        { id: "stem-essentials", title: "STEM Essentials", semester: "Fall 2024", description: "Math + CS mixes" },
        { id: "creative", title: "Creative Lab", semester: "Summer 2024" },
      ],
      addMaterial: (input) => {
        const timestamp = new Date().toISOString()
        const parsed = parseDriveLink(input.fileUrl)
        const materialId = randomId()
        const version: MaterialVersion = {
          id: randomId(),
          fileUrl: input.fileUrl,
          fileType: input.fileType ?? detectFileTypeFromUrl(input.fileUrl),
          addedAt: timestamp,
          uploadedBy: input.uploadedBy,
          notes: input.description?.slice(0, 120),
        }
        const material: Material = {
          id: materialId,
          title: input.title,
          description: input.description,
          subject: input.subject,
          semester: input.semester,
          tags: input.tags ?? [],
          fileType: input.fileType ?? detectFileTypeFromUrl(input.fileUrl),
          fileUrl: input.fileUrl,
          driveId: parsed.id,
          thumbnailUrl: input.thumbnailUrl ?? null,
          uploadedBy: input.uploadedBy,
          createdAt: timestamp,
          updatedAt: timestamp,
          versions: input.versions ?? [version],
          archived: input.archived ?? false,
          collection: input.collection,
        }
        set((state) => ({ materials: [material, ...state.materials] }))
        return material
      },
      addVersion: (materialId, versionInput) => {
        const timestamp = new Date().toISOString()
        const version: MaterialVersion = {
          id: randomId(),
          fileUrl: versionInput.fileUrl,
          fileType: versionInput.fileType ?? detectFileTypeFromUrl(versionInput.fileUrl),
          addedAt: timestamp,
          uploadedBy: versionInput.uploadedBy,
          notes: versionInput.notes,
        }
        set((state) => ({
          materials: state.materials.map((material) =>
            material.id === materialId
              ? {
                  ...material,
                  fileUrl: versionInput.fileUrl,
                  fileType: version.fileType,
                  updatedAt: timestamp,
                  versions: [version, ...material.versions],
                }
              : material
          ),
        }))
        return version
      },
      archiveMaterial: (materialId, archived = true) => {
        set((state) => ({
          materials: state.materials.map((material) =>
            material.id === materialId ? { ...material, archived } : material
          ),
        }))
      },
      archiveVersion: (materialId, versionId, archived = true) => {
        set((state) => ({
          materials: state.materials.map((material) =>
            material.id === materialId
              ? {
                  ...material,
                  versions: material.versions.map((version) =>
                    version.id === versionId ? { ...version, archived } : version
                  ),
                }
              : material
          ),
        }))
      },
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      clearFilters: () => set({ filters: { ...defaultFilters } }),
      search: (query) => set((state) => ({ filters: { ...state.filters, search: query } })),
      toggleBookmark: (materialId) => {
        set((state) => {
          const exists = state.bookmarks.includes(materialId)
          return {
            bookmarks: exists
              ? state.bookmarks.filter((id) => id !== materialId)
              : [...state.bookmarks, materialId],
          }
        })
      },
      setSelectedMaterial: (materialId) => set({ selectedMaterialId: materialId }),
      addSemesterCollection: (collection) => {
        const entry: SemesterCollection = { id: randomId(), ...collection }
        set((state) => ({ semesterCollections: [entry, ...state.semesterCollections] }))
        return entry
      },
      updateMaterialMetadata: (materialId, data) => {
        set((state) => ({
          materials: state.materials.map((material) =>
            material.id === materialId
              ? {
                  ...material,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : material
          ),
        }))
      },
    }),
    {
      name: "study-materials-store",
      storage: createJSONStorage(storageFactory),
      partialize: (state) => ({
        materials: state.materials,
        bookmarks: state.bookmarks,
        semesterCollections: state.semesterCollections,
      }),
      merge: (persisted, current) => {
        if (!persisted) return current
        const typed = persisted as Partial<MaterialsStoreState>
        return {
          ...current,
          ...typed,
          materials: ensureMaterials(typed.materials, current.materials),
          bookmarks: ensureArray(typed.bookmarks, current.bookmarks),
          semesterCollections: ensureArray(typed.semesterCollections, current.semesterCollections),
        }
      },
    }
  )
)

// Context fallback example (if Zustand is unavailable in the runtime):
// export const MaterialsStoreContext = createContext<MaterialsStoreState | null>(null)
// export function useMaterialsStoreFallback() {
//   const ctx = useContext(MaterialsStoreContext)
//   if (!ctx) throw new Error("Materials store not found")
//   return ctx
// }
