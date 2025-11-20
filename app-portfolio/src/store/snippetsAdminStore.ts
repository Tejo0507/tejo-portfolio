import { create } from "zustand"
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware"
import type { Snippet, SnippetVersion } from "@/types/snippet"
import { sampleSnippets } from "@/data/sampleSnippets"
import { addActivity } from "@/utils/activityLog"
import { generateId, timestampNow } from "@/utils/generateId"

export interface SnippetFolder {
  id: string
  name: string
  description?: string
  parentId: string | null
}

interface SnippetAdminState {
  folders: SnippetFolder[]
  snippets: Snippet[]
  selectedSnippetId: string | null
  selectedFolderId: string | null
  bulkSelection: string[]
  setSelectedSnippet: (id: string | null) => void
  setSelectedFolder: (id: string | null) => void
  toggleBulkSelection: (id: string) => void
  clearBulk: () => void
  addFolder: (folder: Omit<SnippetFolder, "id">) => void
  renameFolder: (id: string, name: string) => void
  deleteFolder: (id: string) => void
  addSnippet: (snippet?: Partial<Snippet>) => Snippet
  updateSnippet: (id: string, data: Partial<Snippet>) => void
  deleteSnippet: (id: string) => void
  bulkDelete: () => void
  addVersion: (id: string, version: Omit<SnippetVersion, "id" | "createdAt">) => void
  deleteVersion: (snippetId: string, versionId: string) => void
  resetStore: () => void
  importSnapshot: (folders: SnippetFolder[], snippets: Snippet[]) => void
  exportSnapshot: () => { folders: SnippetFolder[]; snippets: Snippet[] }
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const snippetStorage = createJSONStorage<SnippetAdminState>(() => (typeof window !== "undefined" ? localStorage : memoryStorage))

const defaultFolders: SnippetFolder[] = [
  { id: "hooks", name: "Hooks", parentId: null, description: "React helpers" },
  { id: "python", name: "Python", parentId: null, description: "Data utilities" },
  { id: "sql", name: "SQL", parentId: null, description: "Analytics" },
  { id: "drafts", name: "Drafts", parentId: null, description: "Work in progress" },
]

export const useSnippetsAdminStore = create(
  persist<SnippetAdminState>(
    (set, get) => ({
      folders: defaultFolders,
      snippets: sampleSnippets,
      selectedSnippetId: null,
      selectedFolderId: null,
      bulkSelection: [],
      setSelectedSnippet: (id) => set({ selectedSnippetId: id }),
      setSelectedFolder: (id) => set({ selectedFolderId: id }),
      toggleBulkSelection: (id) =>
        set((state) => ({
          bulkSelection: state.bulkSelection.includes(id)
            ? state.bulkSelection.filter((item) => item !== id)
            : [...state.bulkSelection, id],
        })),
      clearBulk: () => set({ bulkSelection: [] }),
      addFolder: (folder) =>
        set((state) => {
          const next: SnippetFolder = { id: generateId("folder"), ...folder }
          addActivity(next.name, "Created snippet folder", "snippet")
          return { folders: [...state.folders, next] }
        }),
      renameFolder: (id, name) =>
        set((state) => {
          const folder = state.folders.find((item) => item.id === id)
          if (!folder) return state
          addActivity(name, "Renamed snippet folder", "snippet")
          return {
            folders: state.folders.map((item) => (item.id === id ? { ...item, name } : item)),
          }
        }),
      deleteFolder: (id) =>
        set((state) => {
          const folder = state.folders.find((item) => item.id === id)
          if (!folder) return state
          addActivity(folder.name, "Deleted snippet folder", "snippet")
          return {
            folders: state.folders.filter((item) => item.id !== id),
            snippets: state.snippets.map((snippet) =>
              snippet.folderId === id ? { ...snippet, folderId: null } : snippet
            ),
          }
        }),
      addSnippet: (snippet) => {
        const next: Snippet = {
          id: snippet?.id ?? generateId("snippet"),
          title: snippet?.title ?? "New snippet",
          language: snippet?.language ?? "typescript",
          tags: snippet?.tags ?? [],
          description: snippet?.description ?? "",
          code: snippet?.code ?? "// Write story-rich snippet",
          createdAt: timestampNow(),
          updatedAt: timestampNow(),
          author: snippet?.author ?? "Tejo Sridhar M V S",
          versions: snippet?.versions ?? [],
          folderId: snippet?.folderId ?? null,
          favorite: snippet?.favorite,
        }
        set((state) => ({ snippets: [next, ...state.snippets], selectedSnippetId: next.id }))
        addActivity(next.title, "Added snippet", "snippet")
        return next
      },
      updateSnippet: (id, data) =>
        set((state) => {
          const snippet = state.snippets.find((item) => item.id === id)
          if (!snippet) return state
          addActivity(snippet.title, "Updated snippet", "snippet")
          return {
            snippets: state.snippets.map((item) =>
              item.id === id ? { ...item, ...data, updatedAt: timestampNow() } : item
            ),
          }
        }),
      deleteSnippet: (id) =>
        set((state) => {
          const snippet = state.snippets.find((item) => item.id === id)
          if (!snippet) return state
          addActivity(snippet.title, "Deleted snippet", "snippet")
          return {
            snippets: state.snippets.filter((item) => item.id !== id),
            selectedSnippetId: state.selectedSnippetId === id ? null : state.selectedSnippetId,
          }
        }),
      bulkDelete: () =>
        set((state) => {
          if (!state.bulkSelection.length) return state
          addActivity("Snippets", `Bulk delete ${state.bulkSelection.length} items`, "snippet")
          return {
            snippets: state.snippets.filter((snippet) => !state.bulkSelection.includes(snippet.id)),
            bulkSelection: [],
          }
        }),
      addVersion: (id, version) =>
        set((state) => {
          const snippet = state.snippets.find((item) => item.id === id)
          if (!snippet) return state
          addActivity(snippet.title, "Added snippet version", "snippet")
          return {
            snippets: state.snippets.map((item) =>
              item.id === id
                ? {
                    ...item,
                    versions: [
                      {
                        id: generateId("version"),
                        createdAt: timestampNow(),
                        ...version,
                      },
                      ...item.versions,
                    ],
                  }
                : item
            ),
          }
        }),
      deleteVersion: (snippetId, versionId) =>
        set((state) => {
          const snippet = state.snippets.find((item) => item.id === snippetId)
          if (!snippet) return state
          addActivity(snippet.title, "Removed snippet version", "snippet")
          return {
            snippets: state.snippets.map((item) =>
              item.id === snippetId
                ? { ...item, versions: item.versions.filter((version) => version.id !== versionId) }
                : item
            ),
          }
        }),
      resetStore: () => {
        set({ folders: defaultFolders, snippets: sampleSnippets, bulkSelection: [] })
        addActivity("Snippets", "Reset snippet store", "snippet")
      },
      importSnapshot: (folders, snippets) => {
        set({ folders, snippets })
        addActivity("Snippets", "Imported snapshot", "snippet")
      },
      exportSnapshot: () => ({ folders: get().folders, snippets: get().snippets }),
    }),
    {
      name: "portfolio-admin-snippets",
      storage: snippetStorage,
      skipHydration: typeof window === "undefined",
    }
  )
)

// Context fallback sample if Zustand becomes unavailable could wrap this store in React context.
