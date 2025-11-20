import { useMemo } from "react"
import { Bookmark, BookmarkCheck, Trash2 } from "lucide-react"
import { useBookStore } from "@/store/bookStore"
import { getTextExcerpt } from "@/utils/bookUtils"
import { cn } from "@/utils"

interface BookmarkBtnProps {
  currentChapterSlug: string | null
  chapterTitle?: string
  currentPage: number
  currentPageHtml: string
  isOpen: boolean
  onOpenChange: (next: boolean) => void
}

export function BookmarkBtn({
  currentChapterSlug,
  chapterTitle,
  currentPage,
  currentPageHtml,
  isOpen,
  onOpenChange,
}: BookmarkBtnProps) {
  const bookmarks = useBookStore((state) => state.bookmarks)
  const addBookmark = useBookStore((state) => state.addBookmark)
  const removeBookmark = useBookStore((state) => state.removeBookmark)
  const setCurrentChapter = useBookStore((state) => state.setCurrentChapter)
  const setCurrentPage = useBookStore((state) => state.setCurrentPage)

  const hasBookmark = useMemo(
    () => bookmarks.some((bookmark) => bookmark.slug === currentChapterSlug && bookmark.page === currentPage),
    [bookmarks, currentChapterSlug, currentPage]
  )

  const handleBookmark = () => {
    if (!currentChapterSlug) return
    if (hasBookmark) {
      const entry = bookmarks.find((bookmark) => bookmark.slug === currentChapterSlug && bookmark.page === currentPage)
      if (entry) {
        removeBookmark(entry.id)
      }
      return
    }

    const excerpt = getTextExcerpt(currentPageHtml, 0, 120)
    addBookmark({
      slug: currentChapterSlug,
      chapterTitle: chapterTitle ?? "Untitled chapter",
      page: currentPage,
      excerpt,
    })
    onOpenChange(true)
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-pressed={hasBookmark}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => onOpenChange(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
          hasBookmark
            ? "border-[#F7E6D4]/80 bg-[#5E4B43]/50 text-[#F7E6D4]"
            : "border-[#5E4B43]/80 bg-[#2E1F1B]/80 text-[#F7E6D4]/80 hover:border-[#F7E6D4]/60"
        )}
      >
        {hasBookmark ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        Bookmarks
      </button>

      <button
        type="button"
        onClick={handleBookmark}
        className="ml-3 rounded-full border border-[#F7E6D4]/30 bg-[#5E4B43]/40 p-2 text-[#F7E6D4]/90 transition hover:bg-[#5E4B43]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7E6D4]"
        aria-label={hasBookmark ? "Remove bookmark for this page" : "Add bookmark for this page"}
      >
        <Bookmark className="h-4 w-4" fill={hasBookmark ? "currentColor" : "none"} />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Saved bookmarks"
          className="absolute right-0 z-20 mt-3 w-[22rem] max-w-[90vw] rounded-2xl border border-[#5E4B43]/60 bg-[#2E1F1B]/95 p-4 text-[#F7E6D4] shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Bookmarks</h3>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-sm text-[#F7E6D4]/70 underline-offset-2 hover:underline"
            >
              Close
            </button>
          </div>

          <p className="mt-1 text-xs text-[#F7E6D4]/70">
            You have {bookmarks.length} saved {bookmarks.length === 1 ? "page" : "pages"}. Click Go to jump back in time.
          </p>

          <div className="mt-3 flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
            {bookmarks.map((bookmark) => (
              <article
                key={bookmark.id}
                className="rounded-xl border border-[#5E4B43]/50 bg-[#2E1F1B]/70 p-3 shadow-inner shadow-[#2E1F1B]/50"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#F7E6D4]/60">
                  <span>{bookmark.chapterTitle}</span>
                  <span>Page {bookmark.page + 1}</span>
                </div>
                <p className="mt-2 text-sm text-[#F7E6D4]">{bookmark.excerpt || "No excerpt"}</p>
                <p className="mt-1 text-[0.7rem] text-[#F7E6D4]/50">
                  Saved {new Date(bookmark.createdAt).toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    className="rounded-full border border-[#F7E6D4]/40 px-3 py-1 text-[#F7E6D4] transition hover:bg-[#5E4B43]/60"
                    onClick={() => {
                      setCurrentChapter(bookmark.slug)
                      setCurrentPage(bookmark.page)
                      onOpenChange(false)
                    }}
                  >
                    Go
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-[#F28A8A] transition hover:border-[#F28A8A]"
                    onClick={() => removeBookmark(bookmark.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </article>
            ))}
            {!bookmarks.length && (
              <p className="text-sm text-[#F7E6D4]/70">
                Add your first bookmark to capture a favorite spread. Bookmarks sync locally and stay private.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
