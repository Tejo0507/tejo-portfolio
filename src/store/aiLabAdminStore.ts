import { create } from "zustand"
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware"
import type { AdminAiTool } from "@/data/sampleAiTools"
import { sampleAiTools } from "@/data/sampleAiTools"
import { addActivity } from "@/utils/activityLog"
import { generateId } from "@/utils/generateId"

interface AiLabAdminState {
  tools: AdminAiTool[]
  selectedId: string | null
  drawerOpen: boolean
  addTool: (tool?: Partial<AdminAiTool>) => void
  updateTool: (id: string, data: Partial<AdminAiTool>) => void
  deleteTool: (id: string) => void
  toggleVisibility: (id: string) => void
  addPrompt: (id: string, prompt: string) => void
  removePrompt: (id: string, prompt: string) => void
  setSelected: (id: string | null) => void
  toggleDrawer: (open: boolean) => void
  importTools: (data: AdminAiTool[]) => void
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const toolStorage = createJSONStorage<AiLabAdminState>(() => (typeof window !== "undefined" ? localStorage : memoryStorage))

export const useAiLabAdminStore = create(
  persist<AiLabAdminState>(
    (set) => ({
      tools: sampleAiTools,
      selectedId: null,
      drawerOpen: false,
      addTool: (tool) =>
        set((state) => {
          const next: AdminAiTool = {
            id: tool?.id ?? generateId("ai-tool"),
            name: tool?.name ?? "Untitled tool",
            description: tool?.description ?? "",
            tags: tool?.tags ?? [],
            icon: tool?.icon ?? "Sparkles",
            category: tool?.category ?? "Utility",
            visible: tool?.visible ?? true,
            examplePrompts: tool?.examplePrompts ?? [],
          }
          addActivity(next.name, "Created AI tool", "ai-tool")
          return { tools: [next, ...state.tools], selectedId: next.id, drawerOpen: true }
        }),
      updateTool: (id, data) =>
        set((state) => {
          const tool = state.tools.find((entry) => entry.id === id)
          if (!tool) return state
          addActivity(tool.name, "Updated AI tool", "ai-tool")
          return {
            tools: state.tools.map((entry) => (entry.id === id ? { ...entry, ...data } : entry)),
          }
        }),
      deleteTool: (id) =>
        set((state) => {
          const tool = state.tools.find((entry) => entry.id === id)
          if (!tool) return state
          addActivity(tool.name, "Deleted AI tool", "ai-tool")
          return {
            tools: state.tools.filter((entry) => entry.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId,
          }
        }),
      toggleVisibility: (id) =>
        set((state) => {
          const tool = state.tools.find((entry) => entry.id === id)
          if (!tool) return state
          addActivity(tool.name, tool.visible ? "Hid AI tool" : "Published AI tool", "ai-tool")
          return {
            tools: state.tools.map((entry) => (entry.id === id ? { ...entry, visible: !entry.visible } : entry)),
          }
        }),
      addPrompt: (id, prompt) =>
        set((state) => {
          const tool = state.tools.find((entry) => entry.id === id)
          if (!tool) return state
          addActivity(tool.name, "Added prompt", "ai-tool")
          return {
            tools: state.tools.map((entry) =>
              entry.id === id ? { ...entry, examplePrompts: [prompt, ...entry.examplePrompts] } : entry
            ),
          }
        }),
      removePrompt: (id, prompt) =>
        set((state) => {
          const tool = state.tools.find((entry) => entry.id === id)
          if (!tool) return state
          addActivity(tool.name, "Removed prompt", "ai-tool")
          return {
            tools: state.tools.map((entry) =>
              entry.id === id
                ? { ...entry, examplePrompts: entry.examplePrompts.filter((entryPrompt) => entryPrompt !== prompt) }
                : entry
            ),
          }
        }),
      setSelected: (id) => set({ selectedId: id }),
      toggleDrawer: (open) => set({ drawerOpen: open }),
      importTools: (data) => {
        set({ tools: data })
        addActivity("AI Lab", "Imported tools", "ai-tool")
      },
    }),
    {
      name: "portfolio-admin-ai-tools",
      storage: toolStorage,
      skipHydration: typeof window === "undefined",
    }
  )
)

// Context fallback example: wrap `useAiLabAdminStore` within React context if Zustand becomes unavailable.
