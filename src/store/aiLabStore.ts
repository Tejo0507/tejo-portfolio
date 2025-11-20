import { create } from "zustand"
import { createContext, useContext } from "react"
import { aiLabSampleData } from "@/data/aiLabSamples"
import { applyScaling as runScaling } from "@/utils/scaling"
import type { ScalingMethod } from "@/utils/scaling"

export type AiToolId =
  | "image-classification"
  | "text-sentiment"
  | "number-predictor"
  | "kmeans"
  | "pca"
  | "tokenizer"
  | "chatbot"
  | "matrix"
  | "scaling"

export interface UploadedDataset {
  name: string
  rows: Record<string, unknown>[]
}

export interface AiLabStore {
  selectedTool: AiToolId | null
  uploadedData: UploadedDataset | null
  scaledData: Record<string, number>[]
  chartData: number[]
  setSelectedTool: (tool: AiToolId | null) => void
  setUploadedData: (dataset: UploadedDataset | null) => void
  applyScaling: (method: ScalingMethod) => { diagnostics: { field: string; raw: number; scaled: number }[] }
  resetTool: () => void
  setChartData: (points: number[]) => void
}

const defaultUploadedData: UploadedDataset = {
  name: "Sample Sessions",
  rows: aiLabSampleData as unknown as Record<string, unknown>[],
}

export const useAiLabStore = create<AiLabStore>((set, get) => ({
  selectedTool: null,
  uploadedData: defaultUploadedData,
  scaledData: [],
  chartData: [],
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setUploadedData: (dataset) => set({ uploadedData: dataset, scaledData: [] }),
  applyScaling: (method) => {
    const data = get().uploadedData?.rows ?? []
    const { scaledRows, diagnostics } = runScaling(data as Record<string, number>[], method)
    set({
      scaledData: scaledRows,
      chartData: diagnostics.slice(0, 40).map((entry) => entry.scaled),
    })
    return { diagnostics }
  },
  resetTool: () => set({ scaledData: [], chartData: [], selectedTool: null }),
  setChartData: (points) => set({ chartData: points }),
}))

// React Context fallback (for environments where Zustand is unavailable, such as testing sandboxes)
export const AiLabStoreContext = createContext<AiLabStore | null>(null)

/**
 * Hook reserved for future SSR builds where Zustand might be replaced with Context.
 * Wrap components with <AiLabStoreContext.Provider value={value}> to opt in.
 */
export function useAiLabStoreFallback() {
  const ctx = useContext(AiLabStoreContext)
  if (!ctx) throw new Error("AiLabStoreContext missing provider")
  return ctx
}
