import { useEffect, useMemo, useRef, useState } from "react"
import { Search, ArrowUpRight, Loader2 } from "lucide-react"
import { useBookStore } from "@/store/bookStore"
import { DEFAULT_CHARS_PER_PAGE } from "@/utils/bookUtils"
import { cn } from "@/utils"

interface SearchInsideBookProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  focusTrigger: number
}

interface HighlightPart {
  text: string
  highlight: boolean
}

interface SearchResult {
  id: string
  slug: string
  title: string
  snippet: HighlightPart[]
  page: number
}

const MIN_TERM_LENGTH = 2

export function SearchInsideBook({ isOpen, onOpenChange, focusTrigger }: SearchInsideBookProps) {
  const searchIndex = useBookStore((state) => state.searchIndex)
  const setCurrentChapter = useBookStore((state) => state.setCurrentChapter)
  const setCurrentPage = useBookStore((state) => state.setCurrentPage)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => window.clearTimeout(id)
  }, [query])

  useEffect(() => {
    if (isOpen && focusTrigger > 0) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [focusTrigger, isOpen])

  const results = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < MIN_TERM_LENGTH) {
      return []
    }
    const escaped = debouncedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(escaped, "gi")
    const collected: SearchResult[] = []

    searchIndex.forEach((entry) => {
      if (!entry.text) return
      let match: RegExpExecArray | null
      let guard = 0
      while ((match = regex.exec(entry.text)) && guard < 5) {
        guard += 1
        const start = Math.max(0, match.index - 80)
        const rawSnippet = entry.text.slice(start, start + 200).trim()
        collected.push({
          id: `${entry.slug}-${match.index}`,
          slug: entry.slug,
          title: entry.title,
          snippet: createHighlightParts(rawSnippet, new RegExp(regex.source, regex.flags)),
          page: Math.max(0, Math.floor(match.index / DEFAULT_CHARS_PER_PAGE)),
        })
      }
    })

    return collected.slice(0, 30)
  }, [debouncedQuery, searchIndex])

  const handleNavigate = (result: SearchResult) => {
    setCurrentChapter(result.slug)
    setCurrentPage(result.page)
    onOpenChange(false)
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 flex items-start justify-center px-4 py-10 text-[#F7E6D4] transition",
        isOpen ? "pointer-events-auto bg-[#2E1F1B]/60 opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!isOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false)
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "pointer-events-auto w-full max-w-3xl rounded-3xl border border-[#5E4B43]/70 bg-[#2E1F1B] p-6 shadow-2xl shadow-[#2E1F1B]/70",
          isOpen ? "translate-y-0" : "-translate-y-4"
        )}
      >
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the Codex (press /)"
            className="w-full bg-transparent text-lg outline-none placeholder:text-[#F7E6D4]/50"
            aria-label="Search inside book"
          />
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setDebouncedQuery("")
              onOpenChange(false)
            }}
            className="rounded-full border border-[#5E4B43]/60 px-3 py-1 text-sm text-[#F7E6D4]/70 hover:text-[#F7E6D4]"
          >
            Esc
          </button>
        </div>

        <div className="mt-4 text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">
          {debouncedQuery.length >= MIN_TERM_LENGTH
            ? `${results.length} result${results.length === 1 ? "" : "s"}`
            : "Type at least two letters"}
        </div>

        <div className="mt-3 max-h-[50vh] overflow-y-auto pr-2">
          {!searchIndex.length && (
            <div className="flex items-center gap-2 rounded-2xl border border-dashed border-[#5E4B43]/60 p-4 text-sm text-[#F7E6D4]/70">
              <Loader2 className="h-4 w-4 animate-spin" />
              Indexing chapters… once ready, you can search every page.
            </div>
          )}

          {results.map((result) => (
            <article
              key={result.id}
              className="mb-3 rounded-2xl border border-[#5E4B43]/50 bg-[#2E1F1B]/70 p-4 shadow-inner shadow-[#2E1F1B]/40"
            >
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">{result.title}</p>
                  <p className="text-sm text-[#F7E6D4]/80">Page {result.page + 1}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigate(result)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#F7E6D4]/40 px-3 py-1 text-sm text-[#F7E6D4] transition hover:bg-[#5E4B43]/60"
                >
                  Go <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-[#F7E6D4]/90">
                {result.snippet.map((part, index) =>
                  part.highlight ? (
                    <mark key={`${result.id}-${index}`} className="rounded bg-[#F7E6D4]/30 px-1 py-0.5 text-[#2E1F1B]">
                      {part.text}
                    </mark>
                  ) : (
                    <span key={`${result.id}-${index}`}>{part.text}</span>
                  )
                )}
              </p>
            </article>
          ))}

          {debouncedQuery.length >= MIN_TERM_LENGTH && !results.length && searchIndex.length > 0 && (
            <p className="rounded-2xl border border-dashed border-[#5E4B43]/60 p-4 text-sm text-[#F7E6D4]/70">
              No passages matched your query. Try a different keyword or broaden your search.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function createHighlightParts(snippet: string, regex: RegExp): HighlightPart[] {
  const parts: HighlightPart[] = []
  const matches = [...snippet.matchAll(regex)]
  if (!matches.length) {
    return [{ text: snippet, highlight: false }]
  }

  let lastIndex = 0
  matches.forEach((match) => {
    if (!match.index && match.index !== 0) return
    if (match.index > lastIndex) {
      parts.push({ text: snippet.slice(lastIndex, match.index), highlight: false })
    }
    parts.push({ text: match[0], highlight: true })
    lastIndex = match.index + match[0].length
  })

  if (lastIndex < snippet.length) {
    parts.push({ text: snippet.slice(lastIndex), highlight: false })
  }
  return parts
}
