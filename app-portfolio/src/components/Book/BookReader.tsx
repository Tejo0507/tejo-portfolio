import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type RefObject } from "react"
import type { BookChapter } from "@/data/bookManifest"
import { fetchBookManifest } from "@/data/bookManifest"
import { useBookStore } from "@/store/bookStore"
import { DEFAULT_CHARS_PER_PAGE, extractPlainText, loadFile, parseMarkdown, sanitizeHtml } from "@/utils/bookUtils"
import { PageTurn, type PageTurnPage } from "./PageTurn"

interface BookReaderProps {
  onManifestLoaded?: () => void
  onChapterChange?: (slug: string | null) => void
  onPageMetaChange?: (meta: { totalPages: number; currentHtml: string }) => void
}

const PAGE_BREAK_REGEX = /<!--\s*pagebreak\s*-->|<hr[^>]*data-page-break[^>]*>/gi

export const BookReader = forwardRef<HTMLDivElement, BookReaderProps>(function BookReader({ onManifestLoaded, onChapterChange, onPageMetaChange }, ref) {
  const manifest = useBookStore((state) => state.manifest)
  const chapters = useBookStore((state) => state.chapters)
  const currentChapterSlug = useBookStore((state) => state.currentChapterSlug)
  const currentPageNumber = useBookStore((state) => state.currentPageNumber)
  const chapterHtml = useBookStore((state) => state.chapterHtml)
  const twoPageMode = useBookStore((state) => state.twoPageMode)
  const loading = useBookStore((state) => state.loading)
  const setManifest = useBookStore((state) => state.setManifest)
  const setChapterHtml = useBookStore((state) => state.setChapterHtml)
  const setCurrentPage = useBookStore((state) => state.setCurrentPage)
  const toggleTwoPage = useBookStore((state) => state.toggleTwoPage)
  const setLoading = useBookStore((state) => state.setLoading)
  const setError = useBookStore((state) => state.setError)
  const upsertSearchEntry = useBookStore((state) => state.upsertSearchEntry)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const assignRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (!ref) return
      if (typeof ref === "function") {
        ref(node)
      } else {
        ;(ref as MutableRefObject<HTMLDivElement | null>).current = node
      }
    },
    [ref]
  )
  const [pageCount, setPageCount] = useState(1)
  const prevPageRef = useRef(0)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [prefetched, setPrefetched] = useState(false)
  const autoTwoPageApplied = useRef(false)

  const loadChapterContent = useCallback(
    async (chapter: BookChapter, signal?: AbortSignal) => {
      const raw = await loadFile(chapter.file, signal)
      const html = chapter.file.endsWith(".md") ? parseMarkdown(raw) : raw
      const safe = sanitizeHtml(html)
      setChapterHtml(chapter.slug, safe)
      upsertSearchEntry({ slug: chapter.slug, title: chapter.title, html: safe, text: extractPlainText(safe) })
    },
    [setChapterHtml, upsertSearchEntry]
  )

  useEffect(() => {
    if (manifest || loading) {
      return
    }
    const controller = new AbortController()
    const loadManifest = async () => {
      try {
        setLoading(true)
        const data = await fetchBookManifest(controller.signal)
        setManifest(data)
        onManifestLoaded?.()
      } catch (error) {
        console.error(error)
        setError("Unable to load book manifest.")
      } finally {
        setLoading(false)
      }
    }
    loadManifest()
    return () => controller.abort()
  }, [manifest, loading, setManifest, setLoading, setError, onManifestLoaded])

  useEffect(() => {
    if (typeof window === "undefined" || !chapters.length || autoTwoPageApplied.current) return
    const media = window.matchMedia("(min-width: 1024px)")
    if (media.matches && !twoPageMode) {
      toggleTwoPage(true)
    }
    autoTwoPageApplied.current = true
  }, [chapters.length, twoPageMode, toggleTwoPage])

  useEffect(() => {
    const chapter = chapters.find((entry) => entry.slug === currentChapterSlug)
    if (!chapter || chapterHtml[chapter.slug]) {
      return
    }
    const controller = new AbortController()
    const fetchChapter = async () => {
      try {
        await loadChapterContent(chapter, controller.signal)
      } catch (error) {
        console.warn("Failed to load chapter", error)
        setError("Unable to load this chapter. Please try another one.")
      }
    }
    fetchChapter()
    return () => controller.abort()
  }, [chapters, currentChapterSlug, chapterHtml, loadChapterContent, setError])

  useEffect(() => {
    if (prefetched || !chapters.length) {
      return
    }
    const controller = new AbortController()
    const queue = chapters.slice(0)
    const warm = async () => {
      for (const chapter of queue) {
        if (chapterHtml[chapter.slug]) {
          continue
        }
        try {
          await loadChapterContent(chapter, controller.signal)
        } catch (error) {
          console.warn("Skipping chapter prefetch", error)
        }
      }
      setPrefetched(true)
    }
    warm()
    return () => controller.abort()
  }, [chapters, chapterHtml, prefetched, loadChapterContent])

  useEffect(() => {
    if (onChapterChange) {
      onChapterChange(currentChapterSlug ?? null)
    }
  }, [currentChapterSlug, onChapterChange])

  const pages = useMemo(() => {
    if (!currentChapterSlug) return []
    const html = chapterHtml[currentChapterSlug]
    if (!html) return []
    const manualPages = html.split(PAGE_BREAK_REGEX).map((page) => page.trim()).filter(Boolean)
    if (manualPages.length > 1) {
      return manualPages
    }
    return fallbackPaginate(html)
  }, [chapterHtml, currentChapterSlug])

  useEffect(() => {
    if (!pages.length) return
    const nextPageCount = pages.length
    setPageCount(nextPageCount)
    const maxIndex = computeMaxIndex(nextPageCount, twoPageMode)
    if (currentPageNumber > maxIndex) {
      setCurrentPage(maxIndex)
    }
  }, [pages, twoPageMode, currentPageNumber, setCurrentPage])

  useEffect(() => {
    if (currentPageNumber > prevPageRef.current) {
      setDirection("forward")
    } else if (currentPageNumber < prevPageRef.current) {
      setDirection("backward")
    }
    prevPageRef.current = currentPageNumber
  }, [currentPageNumber])

  const nextPage = useCallback(() => {
    const maxIndex = computeMaxIndex(pageCount, twoPageMode)
    const step = twoPageMode ? 2 : 1
    setCurrentPage(Math.min(currentPageNumber + step, maxIndex))
  }, [currentPageNumber, pageCount, twoPageMode, setCurrentPage])

  const previousPage = useCallback(() => {
    const step = twoPageMode ? 2 : 1
    setCurrentPage(Math.max(0, currentPageNumber - step))
  }, [currentPageNumber, twoPageMode, setCurrentPage])

  useSwipeNavigation(containerRef, nextPage, previousPage)

  const visiblePages: PageTurnPage[] = useMemo(() => {
    if (!currentChapterSlug || !pages.length) {
      return []
    }
    const index = twoPageMode ? Math.max(0, currentPageNumber - (currentPageNumber % 2)) : currentPageNumber
    const first = pages[index] ?? ""
    const second = twoPageMode ? pages[index + 1] : undefined
    const items: PageTurnPage[] = []
    if (first) {
      items.push({ id: `${currentChapterSlug}-${index}`, html: first, label: `Page ${index + 1}` })
    }
    if (second) {
      items.push({ id: `${currentChapterSlug}-${index + 1}`, html: second, label: `Page ${index + 2}` })
    }
    return items
  }, [pages, currentChapterSlug, twoPageMode, currentPageNumber])

  useEffect(() => {
    onPageMetaChange?.({
      totalPages: pageCount,
      currentHtml: visiblePages[0]?.html ?? "",
    })
  }, [pageCount, visiblePages, onPageMetaChange])

  useEffect(() => {
    if (typeof window === "undefined") return
    const handler = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).tagName === "INPUT") return
      if (event.key === "ArrowRight") {
        event.preventDefault()
        nextPage()
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        previousPage()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [nextPage, previousPage])

  return (
  <div ref={assignRefs} className="flex h-full w-full flex-col gap-4 text-[#F7E6D4]">
      <div className="flex items-center justify-between rounded-2xl border border-[#5E4B43]/50 bg-[#2E1F1B]/70 px-4 py-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">{manifest?.title ?? "Portfolio Codex"}</p>
          <p className="text-lg font-semibold">{chapters.find((chapter) => chapter.slug === currentChapterSlug)?.title ?? "Select a chapter"}</p>
        </div>
        <div className="text-right text-sm">
          <p>Page {Math.min(pageCount, currentPageNumber + 1)} / {pageCount}</p>
          <p className="text-[#F7E6D4]/60">{twoPageMode ? "Dual" : "Single"} spread</p>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-[28px] border border-[#5E4B43]/40 bg-[#2E1F1B]/60 p-3">
        {loading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-[#2E1F1B]/60 text-sm uppercase tracking-[0.5em] text-[#F7E6D4]/70">
            Loading Codex…
          </div>
        )}
        {visiblePages.length ? (
          <PageTurn
            pages={visiblePages}
            direction={direction}
            onNext={nextPage}
            onPrevious={previousPage}
            isTwoPage={twoPageMode}
            className="h-full"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#F7E6D4]/70">
            {currentChapterSlug ? "Preparing chapter…" : "Choose a chapter from the sidebar"}
          </div>
        )}
      </div>
    </div>
  )
})

function fallbackPaginate(html: string) {
  const segments = html.split(/(<\/p>)/i)
  const pages: string[] = []
  let buffer = ""
  let charCount = 0
  segments.forEach((segment) => {
    if (!segment) return
    buffer += segment
    charCount += extractPlainText(segment).length
    if (charCount >= DEFAULT_CHARS_PER_PAGE) {
      pages.push(buffer)
      buffer = ""
      charCount = 0
    }
  })
  if (buffer.trim()) {
    pages.push(buffer)
  }
  return pages.length ? pages : [html]
}

function computeMaxIndex(totalPages: number, twoPageMode: boolean) {
  if (!twoPageMode) {
    return Math.max(0, totalPages - 1)
  }
  return Math.max(0, totalPages - (totalPages % 2 === 0 ? 2 : 1))
}

function useSwipeNavigation(ref: RefObject<HTMLDivElement | null>, onNext: () => void, onPrev: () => void) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let startX = 0
    let startTime = 0

    const onPointerDown = (event: PointerEvent) => {
      startX = event.clientX
      startTime = Date.now()
    }
    const onPointerUp = (event: PointerEvent) => {
      const deltaX = event.clientX - startX
      const deltaTime = Date.now() - startTime
      if (Math.abs(deltaX) > 80 && deltaTime < 800) {
        if (deltaX < 0) {
          onNext()
        } else {
          onPrev()
        }
      }
    }

    element.addEventListener("pointerdown", onPointerDown)
    element.addEventListener("pointerup", onPointerUp)

    return () => {
      element.removeEventListener("pointerdown", onPointerDown)
      element.removeEventListener("pointerup", onPointerUp)
    }
  }, [ref, onNext, onPrev])
}

