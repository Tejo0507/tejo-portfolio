import { useEffect, useMemo, useState } from "react"
import { BookOpen, Menu, X } from "lucide-react"
import { cn } from "@/utils"
import { useBookStore } from "@/store/bookStore"

interface ChapterSidebarProps {
  className?: string
}

export function ChapterSidebar({ className }: ChapterSidebarProps) {
  const manifest = useBookStore((state) => state.manifest)
  const chapters = useBookStore((state) => state.chapters)
  const currentChapterSlug = useBookStore((state) => state.currentChapterSlug)
  const setCurrentChapter = useBookStore((state) => state.setCurrentChapter)
  const isSidebarOpen = useBookStore((state) => state.isSidebarOpen)
  const toggleSidebar = useBookStore((state) => state.toggleSidebar)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const media = window.matchMedia("(max-width: 1023px)")
    const update = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches)
    }
    update(media)
    const handler = (event: MediaQueryListEvent) => update(event)
    media.addEventListener?.("change", handler)
    return () => media.removeEventListener?.("change", handler)
  }, [])

  const sortedChapters = useMemo(() => [...chapters].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [chapters])

  return (
    <aside
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-[#5E4B43]/50 bg-[#2E1F1B]/70 p-4 text-[#F7E6D4] shadow-xl shadow-[#2E1F1B]/40 backdrop-blur",
        isMobile
          ? cn(
              "fixed inset-x-4 bottom-4 z-30 max-h-[70vh] translate-y-0 overflow-hidden rounded-3xl transition-transform",
              isSidebarOpen ? "translate-y-0" : "translate-y-[65%]"
            )
          : cn("sticky top-6 h-[calc(100vh-3rem)] w-72 overflow-y-auto", !isSidebarOpen && "pointer-events-none opacity-60"),
        className
      )}
      aria-label="Book chapters"
    >
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/70">Book</p>
          <h2 className="text-lg font-semibold text-[#F7E6D4]">{manifest?.title ?? "Portfolio Codex"}</h2>
        </div>
        <button
          type="button"
          aria-label={isSidebarOpen ? "Collapse chapter panel" : "Expand chapter panel"}
          onClick={() => toggleSidebar()}
          className="rounded-full border border-[#5E4B43]/60 bg-[#2E1F1B] p-2 transition hover:bg-[#5E4B43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7E6D4]"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      <nav className="mt-2 flex flex-1 flex-col gap-2" aria-label="Chapters list">
        {sortedChapters.map((chapter, index) => {
          const active = chapter.slug === currentChapterSlug
          return (
            <button
              key={chapter.slug}
              type="button"
              onClick={() => {
                setCurrentChapter(chapter.slug)
                if (isMobile) {
                  toggleSidebar(false)
                }
              }}
              className={cn(
                "flex flex-col rounded-xl border border-transparent bg-transparent px-3 py-2 text-left transition",
                active
                  ? "border-[#F7E6D4]/60 bg-[#5E4B43]/30 shadow-inner shadow-[#2E1F1B]/50"
                  : "hover:border-[#5E4B43]/60 hover:bg-[#5E4B43]/20"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="text-sm font-medium">Chapter {index + 1}</span>
              <span className="text-base font-semibold text-[#F7E6D4]">{chapter.title}</span>
              <span className="text-xs text-[#F7E6D4]/70">{chapter.file}</span>
            </button>
          )
        })}
        {!sortedChapters.length && (
          <div className="rounded-xl border border-dashed border-[#5E4B43]/60 bg-[#2E1F1B]/40 p-4 text-sm text-[#F7E6D4]/70">
            Place your legacy chapters under <code className="font-mono text-[#F7E6D4]">/book-portfolio/</code> to populate this list.
          </div>
        )}
      </nav>

      <div className="mt-auto rounded-xl border border-[#5E4B43]/40 bg-[#2E1F1B]/70 p-3 text-sm text-[#F7E6D4]/80">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>{sortedChapters.length} chapters</span>
        </div>
        <p className="mt-1 text-xs text-[#F7E6D4]/70">Swipe up on mobile or use the toggle to reveal the chapter drawer.</p>
      </div>
    </aside>
  )
}
