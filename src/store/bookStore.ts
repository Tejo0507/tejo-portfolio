import { create } from "zustand"
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware"
import type { BookChapter, BookManifest } from "@/data/bookManifest"

export interface BookmarkEntry {
  id: string
  slug: string
  chapterTitle: string
  page: number
  excerpt: string
  createdAt: string
}

export interface SearchEntry {
  slug: string
  title: string
  html: string
  text: string
}

export interface BookStoreState {
  manifest: BookManifest | null
  chapters: BookChapter[]
  chapterHtml: Record<string, string>
  currentChapterSlug: string | null
  currentPageNumber: number
  bookmarks: BookmarkEntry[]
  searchIndex: SearchEntry[]
  isSidebarOpen: boolean
  twoPageMode: boolean
  loading: boolean
  error: string | null
  setManifest: (manifest: BookManifest) => void
  setChapterHtml: (slug: string, html: string) => void
  upsertSearchEntry: (entry: SearchEntry) => void
  resetSearchIndex: () => void
  setCurrentChapter: (slug: string) => void
  setCurrentPage: (page: number) => void
  toggleSidebar: (value?: boolean) => void
  toggleTwoPage: (value?: boolean) => void
  addBookmark: (bookmark: Omit<BookmarkEntry, "id" | "createdAt">) => BookmarkEntry | null
  removeBookmark: (id: string) => void
  setLoading: (value: boolean) => void
  setError: (message: string | null) => void
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

// Safe storage wrapper prevents crashes on malformed localStorage entries
const safeStorage: StateStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null
    try {
      return window.localStorage.getItem(name)
    } catch (err) {
      console.warn("[bookStore] getItem failed", err)
      return null
    }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(name, value)
    } catch (err) {
      console.warn("[bookStore] setItem failed", err)
    }
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.removeItem(name)
    } catch (err) {
      console.warn("[bookStore] removeItem failed", err)
    }
  },
}

const storageFactory = () => (typeof window === "undefined" ? memoryStorage : safeStorage)

const randomId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const useBookStore = create<BookStoreState>()(
  persist(
    (set, get) => ({
      manifest: null,
      chapters: [],
      chapterHtml: {},
      currentChapterSlug: null,
      currentPageNumber: 0,
      bookmarks: [],
      searchIndex: [],
      isSidebarOpen: true,
      twoPageMode: false,
      loading: false,
      error: null,
      setManifest: (manifest) => {
        set((state) => {
          const chapters = manifest.chapters ?? []
          const hasCurrent = state.currentChapterSlug && chapters.some((chapter) => chapter.slug === state.currentChapterSlug)
          const fallbackSlug = chapters[0]?.slug ?? null
          return {
            manifest,
            chapters,
            currentChapterSlug: hasCurrent ? state.currentChapterSlug : fallbackSlug,
            currentPageNumber: hasCurrent ? state.currentPageNumber : 0,
          }
        })
      },
      setChapterHtml: (slug, html) =>
        set((state) => ({
          chapterHtml: { ...state.chapterHtml, [slug]: html },
        })),
      upsertSearchEntry: (entry) => {
        set((state) => {
          const existingIndex = state.searchIndex.findIndex((item) => item.slug === entry.slug)
          if (existingIndex >= 0) {
            const next = [...state.searchIndex]
            next[existingIndex] = entry
            return { searchIndex: next }
          }
          return { searchIndex: [...state.searchIndex, entry] }
        })
      },
      resetSearchIndex: () => set({ searchIndex: [] }),
      setCurrentChapter: (slug) => {
        const chapterExists = get().chapters.some((chapter) => chapter.slug === slug)
        if (!chapterExists) return
        set({ currentChapterSlug: slug, currentPageNumber: 0 })
      },
      setCurrentPage: (page) => set({ currentPageNumber: Math.max(0, page) }),
      toggleSidebar: (value) => {
        if (typeof value === "boolean") {
          set({ isSidebarOpen: value })
          return
        }
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
      },
      toggleTwoPage: (value) => {
        if (typeof value === "boolean") {
          set({ twoPageMode: value })
          return
        }
        set((state) => ({ twoPageMode: !state.twoPageMode }))
      },
      addBookmark: (bookmark) => {
        const duplicates = get().bookmarks.filter((existing) => existing.slug === bookmark.slug && existing.page === bookmark.page)
        if (duplicates.length) {
          return null
        }
        const entry: BookmarkEntry = {
          ...bookmark,
          id: randomId(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ bookmarks: [entry, ...state.bookmarks].slice(0, 150) }))
        return entry
      },
      removeBookmark: (id) => set((state) => ({ bookmarks: state.bookmarks.filter((item) => item.id !== id) })),
      setLoading: (value) => set({ loading: value }),
      setError: (message) => set({ error: message }),
    }),
    {
      name: "book-portfolio-store",
      storage: createJSONStorage(storageFactory),
      partialize: (state) => ({
        currentChapterSlug: state.currentChapterSlug,
        currentPageNumber: state.currentPageNumber,
        bookmarks: state.bookmarks,
        twoPageMode: state.twoPageMode,
      }),
    }
  )
)
