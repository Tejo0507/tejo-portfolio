import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { ArrowLeft, ArrowRight, Search, SplitSquareVertical } from "lucide-react"
import { BookReader } from "@/components/Book/BookReader"
import { ChapterSidebar } from "@/components/Book/ChapterSidebar"
import { BookmarkBtn } from "@/components/Book/BookmarkBtn"
import { SearchInsideBook } from "@/components/Book/SearchInsideBook"
import { ExportPDF } from "@/components/Book/ExportPDF"
import { useBookStore } from "@/store/bookStore"

const BookPortfolioPage = () => {
  const readerRef = useRef<HTMLDivElement | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bookmarkOpen, setBookmarkOpen] = useState(false)
  const [searchTrigger, setSearchTrigger] = useState(0)
  const [pageMeta, setPageMeta] = useState({ totalPages: 1, currentHtml: "" })

  const chapters = useBookStore((state) => state.chapters)
  const currentChapterSlug = useBookStore((state) => state.currentChapterSlug)
  const currentPageNumber = useBookStore((state) => state.currentPageNumber)
  const twoPageMode = useBookStore((state) => state.twoPageMode)
  const setCurrentChapter = useBookStore((state) => state.setCurrentChapter)
  const setCurrentPage = useBookStore((state) => state.setCurrentPage)
  const toggleTwoPage = useBookStore((state) => state.toggleTwoPage)

  const currentChapter = useMemo(() => chapters.find((chapter) => chapter.slug === currentChapterSlug), [chapters, currentChapterSlug])

  const handleNext = useCallback(() => {
    const maxIndex = computeMaxIndex(pageMeta.totalPages, twoPageMode)
    const step = twoPageMode ? 2 : 1
    setCurrentPage(Math.min(currentPageNumber + step, maxIndex))
  }, [currentPageNumber, pageMeta.totalPages, twoPageMode, setCurrentPage])

  const handlePrev = useCallback(() => {
    const step = twoPageMode ? 2 : 1
    setCurrentPage(Math.max(0, currentPageNumber - step))
  }, [currentPageNumber, twoPageMode, setCurrentPage])

  useEffect(() => {
    if (typeof window === "undefined") return undefined
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return
      if (event.key === "/" || event.key.toLowerCase() === "s") {
        event.preventDefault()
        setSearchOpen(true)
        setSearchTrigger((value) => value + 1)
      }
      if (event.key.toLowerCase() === "b") {
        event.preventDefault()
        setBookmarkOpen((value) => !value)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleSearchButton = () => {
    setSearchOpen(true)
    setSearchTrigger((value) => value + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1C130F] via-[#2E1F1B] to-[#1C130F] px-4 py-10 text-[#F7E6D4]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-[#5E4B43]/50 bg-[#2E1F1B]/60 p-6 shadow-2xl shadow-[#2E1F1B]/50">
          <p className="text-xs uppercase tracking-[0.5em] text-[#F7E6D4]/60">Legacy Book</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#F7E6D4]">Book Portfolio Reader</h1>
          <p className="mt-3 max-w-3xl text-base text-[#F7E6D4]/80">
            Browse the original flip-book portfolio with modern comforts—search across every spread, drop bookmarks, and
            export chapters as polished PDFs.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          <ChapterSidebar />

          <section className="flex flex-col gap-5 rounded-[32px] border border-[#5E4B43]/40 bg-[#2E1F1B]/40 p-5 shadow-[0_20px_80px_rgba(46,31,27,0.45)]">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#5E4B43]/40 bg-[#2E1F1B]/70 p-4">
              <div className="flex gap-2">
                <ToolbarButton label="Previous page" onClick={handlePrev}>
                  <ArrowLeft className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton label="Next page" onClick={handleNext}>
                  <ArrowRight className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <select
                value={currentChapterSlug ?? ""}
                onChange={(event) => setCurrentChapter(event.target.value)}
                className="flex-1 rounded-2xl border border-[#5E4B43]/60 bg-transparent px-4 py-2 text-sm text-[#F7E6D4]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7E6D4]"
                aria-label="Select chapter"
              >
                <option value="" className="bg-[#2E1F1B] text-[#2E1F1B]">
                  Choose a chapter
                </option>
                {chapters.map((chapter, index) => (
                  <option key={chapter.slug} value={chapter.slug} className="bg-[#2E1F1B] text-[#2E1F1B]">
                    {index + 1}. {chapter.title}
                  </option>
                ))}
              </select>

              <ToolbarButton label="Toggle two-page" onClick={() => toggleTwoPage()} pressed={twoPageMode}>
                <SplitSquareVertical className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton label="Open search" onClick={handleSearchButton}>
                <Search className="h-4 w-4" />
              </ToolbarButton>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <BookmarkBtn
                  currentChapterSlug={currentChapterSlug}
                  chapterTitle={currentChapter?.title}
                  currentPage={currentPageNumber}
                  currentPageHtml={pageMeta.currentHtml}
                  isOpen={bookmarkOpen}
                  onOpenChange={setBookmarkOpen}
                />
                <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">
                  Page {currentPageNumber + 1} / {pageMeta.totalPages}
                </p>
              </div>
              <ExportPDF targetRef={readerRef} />
            </div>

            <BookReader ref={readerRef} onPageMetaChange={setPageMeta} />
          </section>
        </div>
      </div>

      <SearchInsideBook isOpen={searchOpen} onOpenChange={setSearchOpen} focusTrigger={searchTrigger} />
    </div>
  )
}

export default BookPortfolioPage

function ToolbarButton({ label, onClick, children, pressed }: { label: string; onClick: () => void; children: ReactNode; pressed?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl border px-3 py-2 text-sm transition ${
        pressed
          ? "border-[#F7E6D4]/70 bg-[#5E4B43]/70 text-[#F7E6D4]"
          : "border-[#5E4B43]/60 bg-[#2E1F1B]/60 text-[#F7E6D4]/80 hover:border-[#F7E6D4]/50"
      }`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  )
}

function computeMaxIndex(totalPages: number, twoPageMode: boolean) {
  if (!twoPageMode) {
    return Math.max(0, totalPages - 1)
  }
  return Math.max(0, totalPages - (totalPages % 2 === 0 ? 2 : 1))
}
