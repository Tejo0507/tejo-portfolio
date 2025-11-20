import { create } from "zustand"
import { sampleSnippets } from "@/data/sampleSnippets"
import type { Snippet, SnippetFilters } from "@/types/snippet"
import {
  buildTagCounts,
  copySnippetToClipboard,
  downloadSnippet,
  exportSnippetsZip,
  filterSnippets,
} from "@/utils/snippetUtils"

const defaultFilters: SnippetFilters = {
  language: "all",
  tags: [],
  sort: "recent",
}

interface StatusBanner {
  type: "success" | "error"
  message: string
}

export interface SnippetStoreState {
  snippets: Snippet[]
  filteredSnippets: Snippet[]
  selectedSnippetId: string | null
  selectedVersionId: string | null
  searchQuery: string
  filters: SnippetFilters
  tagCounts: Record<string, number>
  isExporting: boolean
  status: StatusBanner | null
  setSearchQuery: (value: string) => void
  setLanguageFilter: (language: SnippetFilters["language"]) => void
  setSort: (sort: SnippetFilters["sort"]) => void
  toggleTag: (tag: string) => void
  clearFilters: () => void
  selectSnippet: (id: string | null) => void
  selectVersion: (versionId: string | null) => void
  toggleFavorite: (id: string) => void
  copySnippet: (id: string) => Promise<void>
  exportSnippet: (id: string) => Promise<void>
  exportFiltered: () => Promise<void>
  acknowledgeStatus: () => void
}

const ensureSelection = (snippets: Snippet[], preferredId: string | null) => {
  if (!snippets.length) return null
  if (preferredId && snippets.some((snippet) => snippet.id === preferredId)) return preferredId
  return snippets[0].id
}

export const useSnippetStore = create<SnippetStoreState>((set, get) => ({
  snippets: sampleSnippets,
  filteredSnippets: filterSnippets(sampleSnippets, "", defaultFilters),
  selectedSnippetId: sampleSnippets[0]?.id ?? null,
  selectedVersionId: null,
  searchQuery: "",
  filters: defaultFilters,
  tagCounts: buildTagCounts(sampleSnippets),
  isExporting: false,
  status: null,
  setSearchQuery: (value) => {
    set((state) => {
      const filteredSnippets = filterSnippets(state.snippets, value, state.filters)
      return {
        searchQuery: value,
        filteredSnippets,
        selectedSnippetId: ensureSelection(filteredSnippets, state.selectedSnippetId),
        selectedVersionId: null,
      }
    })
  },
  setLanguageFilter: (language) => {
    set((state) => {
      const filters = { ...state.filters, language }
      const filteredSnippets = filterSnippets(state.snippets, state.searchQuery, filters)
      return {
        filters,
        filteredSnippets,
        selectedSnippetId: ensureSelection(filteredSnippets, state.selectedSnippetId),
        selectedVersionId: null,
      }
    })
  },
  setSort: (sort) => {
    set((state) => {
      const filters = { ...state.filters, sort }
      const filteredSnippets = filterSnippets(state.snippets, state.searchQuery, filters)
      return {
        filters,
        filteredSnippets,
        selectedSnippetId: ensureSelection(filteredSnippets, state.selectedSnippetId),
      }
    })
  },
  toggleTag: (tag) => {
    set((state) => {
      const exists = state.filters.tags.includes(tag)
      const tags = exists ? state.filters.tags.filter((entry) => entry !== tag) : [...state.filters.tags, tag]
      const filters = { ...state.filters, tags }
      const filteredSnippets = filterSnippets(state.snippets, state.searchQuery, filters)
      return {
        filters,
        filteredSnippets,
        selectedSnippetId: ensureSelection(filteredSnippets, state.selectedSnippetId),
        selectedVersionId: null,
      }
    })
  },
  clearFilters: () => {
    set((state) => {
      const filteredSnippets = filterSnippets(state.snippets, "", defaultFilters)
      return {
        filters: { ...defaultFilters },
        searchQuery: "",
        filteredSnippets,
        selectedSnippetId: ensureSelection(filteredSnippets, state.selectedSnippetId),
        selectedVersionId: null,
      }
    })
  },
  selectSnippet: (id) => set({ selectedSnippetId: id, selectedVersionId: null }),
  selectVersion: (versionId) => set({ selectedVersionId: versionId }),
  toggleFavorite: (id) => {
    set((state) => {
      const snippets = state.snippets.map((snippet) =>
        snippet.id === id ? { ...snippet, favorite: !snippet.favorite, updatedAt: new Date().toISOString() } : snippet
      )
      const filteredSnippets = filterSnippets(snippets, state.searchQuery, state.filters)
      return {
        snippets,
        filteredSnippets,
        tagCounts: buildTagCounts(snippets),
        selectedSnippetId: ensureSelection(filteredSnippets, state.selectedSnippetId),
      }
    })
  },
  copySnippet: async (id) => {
    const snippet = get().snippets.find((entry) => entry.id === id)
    if (!snippet) return
    const version = get().selectedVersionId
      ? snippet.versions.find((entry) => entry.id === get().selectedVersionId)
      : null
    try {
      await copySnippetToClipboard(version?.code ?? snippet.code)
      set({ status: { type: "success", message: "Snippet copied to clipboard" } })
    } catch (error) {
      console.error("Failed to copy snippet", error)
      set({ status: { type: "error", message: "Clipboard copy failed" } })
    }
  },
  exportSnippet: async (id) => {
    const snippet = get().snippets.find((entry) => entry.id === id)
    if (!snippet) return
    const version = get().selectedVersionId
      ? snippet.versions.find((entry) => entry.id === get().selectedVersionId)
      : undefined
    try {
      downloadSnippet(snippet, version)
      set({ status: { type: "success", message: "Snippet exported" } })
    } catch (error) {
      console.error("Snippet export failed", error)
      set({ status: { type: "error", message: "Export failed" } })
    }
  },
  exportFiltered: async () => {
    const filtered = get().filteredSnippets
    if (!filtered.length) {
      set({ status: { type: "error", message: "No snippets match those filters" } })
      return
    }
    set({ isExporting: true })
    try {
      await exportSnippetsZip(filtered)
      set({ status: { type: "success", message: `Exported ${filtered.length} snippet(s)` } })
    } catch (error) {
      console.error("Bulk export failed", error)
      set({ status: { type: "error", message: "Zip export failed" } })
    } finally {
      set({ isExporting: false })
    }
  },
  acknowledgeStatus: () => set({ status: null }),
}))
