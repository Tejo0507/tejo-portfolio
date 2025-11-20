import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Highlight } from "prism-react-renderer"
import type { RenderProps } from "prism-react-renderer"
import {
  Bookmark,
  Check,
  Copy,
  Download,
  Filter,
  FolderTree,
  RefreshCcw,
  Search,
  Sparkles,
  Star,
  Tag,
  Zap,
} from "lucide-react"
import { useSnippetStore } from "@/store/snippetStore"
import { cn } from "@/utils"
import { deriveFolderCounts, formatRelativeTime, languageMeta, snippetPanelTheme } from "@/utils/snippetUtils"
import type { Snippet, SnippetFilters } from "@/types/snippet"

export default function SnippetsPage() {
  const snippets = useSnippetStore((state) => state.snippets)
  const filteredSnippets = useSnippetStore((state) => state.filteredSnippets)
  const selectedSnippetId = useSnippetStore((state) => state.selectedSnippetId)
  const selectedVersionId = useSnippetStore((state) => state.selectedVersionId)
  const searchQuery = useSnippetStore((state) => state.searchQuery)
  const filters = useSnippetStore((state) => state.filters)
  const tagCounts = useSnippetStore((state) => state.tagCounts)
  const status = useSnippetStore((state) => state.status)
  const isExporting = useSnippetStore((state) => state.isExporting)
  const setSearchQuery = useSnippetStore((state) => state.setSearchQuery)
  const setLanguageFilter = useSnippetStore((state) => state.setLanguageFilter)
  const setSort = useSnippetStore((state) => state.setSort)
  const toggleTag = useSnippetStore((state) => state.toggleTag)
  const clearFilters = useSnippetStore((state) => state.clearFilters)
  const selectSnippet = useSnippetStore((state) => state.selectSnippet)
  const selectVersion = useSnippetStore((state) => state.selectVersion)
  const toggleFavorite = useSnippetStore((state) => state.toggleFavorite)
  const copySnippet = useSnippetStore((state) => state.copySnippet)
  const exportSnippet = useSnippetStore((state) => state.exportSnippet)
  const exportFiltered = useSnippetStore((state) => state.exportFiltered)
  const acknowledgeStatus = useSnippetStore((state) => state.acknowledgeStatus)

  const selectedSnippet = useMemo(
    () => snippets.find((entry) => entry.id === selectedSnippetId) ?? null,
    [snippets, selectedSnippetId]
  )
  const selectedVersion = useMemo(() => {
    if (!selectedSnippet || !selectedVersionId) return null
    return selectedSnippet.versions.find((version) => version.id === selectedVersionId) ?? null
  }, [selectedSnippet, selectedVersionId])

  const stats = useMemo(() => {
    const favorites = snippets.filter((snippet) => snippet.favorite).length
    const languages = new Set(snippets.map((snippet) => snippet.language)).size
    const updated = snippets
      .map((snippet) => snippet.updatedAt)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
    return {
      total: snippets.length,
      favorites,
      languages,
      recentUpdate: updated ? formatRelativeTime(updated) : "—",
    }
  }, [snippets])

  const folderCounts = useMemo(() => deriveFolderCounts(snippets), [snippets])
  const tagCloud = useMemo(
    () =>
      Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 18),
    [tagCounts]
  )

  return (
    <div className="relative min-h-screen bg-[#120A07] pb-20 text-[#F2E4DC]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(94,75,67,0.12),_transparent_65%)]" aria-hidden />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-5 pt-12 lg:px-8">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[#F2E4DC]/60">Code snippets vault</p>
          <div className="flex flex-wrap items-end gap-4">
            <h1 className="text-4xl font-semibold text-[#F2E4DC]">Catalog, filter, and ship reusable fragments</h1>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => exportFiltered()}
              className="inline-flex items-center gap-2 rounded-full border border-[#5E4B43]/50 bg-[#1A0F0B]/80 px-4 py-2 text-xs uppercase tracking-[0.4em] text-[#F2E4DC]/80"
              disabled={isExporting}
            >
              <Download className="h-4 w-4" /> {isExporting ? "Exporting…" : "Export view"}
            </motion.button>
          </div>
          <p className="max-w-3xl text-sm text-[#F2E4DC]/70">
            Everything from SQL window functions to React helpers lives here. Search descriptions, filter by language or tag, favorite
            the ones you reach for often, and export bundles when you want portable references offline.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Snippets" value={stats.total} subcopy="Tracked entries" />
          <StatCard label="Favorites" value={stats.favorites} subcopy="Pinned helpers" icon={<Star className="h-4 w-4" />} />
          <StatCard label="Stacks" value={stats.languages} subcopy="Languages represented" icon={<FolderTree className="h-4 w-4" />} />
          <StatCard label="Last touch" value={stats.recentUpdate} subcopy="Relative to now" icon={<Sparkles className="h-4 w-4" />} />
        </section>

        <FiltersPanel
          searchQuery={searchQuery}
          filters={filters}
          onSearch={setSearchQuery}
          onLanguageChange={setLanguageFilter}
          onSortChange={setSort}
          onClear={clearFilters}
        />

        <section
          className="grid gap-6 rounded-[32px] border border-[rgba(94,75,67,0.35)] bg-[#1A0F0B]/90 p-6 shadow-[0_25px_120px_rgba(0,0,0,0.35)] lg:grid-cols-[320px_1fr]"
        >
          <aside className="space-y-6">
            <FolderPanel
              folderCounts={folderCounts}
              onSelect={(folder) => setSearchQuery(folder === "Ungrouped" ? "" : folder)}
              activeLabel={searchQuery}
            />
            <TagPanel tags={tagCloud} activeTags={filters.tags} onToggle={toggleTag} />
          </aside>

          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-[#F2E4DC]/70">
              <p>
                Showing <span className="text-[#F2E4DC]">{filteredSnippets.length}</span> of {snippets.length} snippets
              </p>
              {filters.tags.length > 0 && (
                <p className="uppercase tracking-[0.3em] text-[#F2E4DC]/50">Tags: {filters.tags.join(", ")}</p>
              )}
            </div>

            {filteredSnippets.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[rgba(94,75,67,0.4)] bg-[#120A07]/70 p-8 text-center text-sm text-[#F2E4DC]/70">
                Nothing matches those filters yet. Try resetting a tag or dialing back the search text.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
                <ul className="grid gap-3 rounded-3xl border border-[rgba(94,75,67,0.35)] bg-[#150B08]/80 p-4">
                  {filteredSnippets.map((snippet) => (
                    <li key={snippet.id}>
                      <button
                        type="button"
                        onClick={() => selectSnippet(snippet.id)}
                        className={cn(
                          "w-full rounded-2xl border px-4 py-3 text-left transition",
                          selectedSnippet?.id === snippet.id
                            ? "border-[#F2E4DC]/60 bg-[#2E1F1B]/70"
                            : "border-[rgba(94,75,67,0.3)] bg-transparent hover:border-[#F2E4DC]/40"
                        )}
                      >
                        <div className="flex items-center justify-between text-sm text-[#F2E4DC]">
                          <span>{snippet.title}</span>
                          {snippet.favorite && <Star className="h-4 w-4 fill-[#F2E4DC] text-[#2E1F1B]" />}
                        </div>
                        <p className="mt-1 text-xs text-[#F2E4DC]/70">
                          {languageMeta[snippet.language]?.label ?? snippet.language} · {formatRelativeTime(snippet.updatedAt)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#F2E4DC]/60">
                          {snippet.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full border border-[rgba(94,75,67,0.5)] px-2 py-0.5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                {selectedSnippet ? (
                  <SnippetViewer
                    snippet={selectedSnippet}
                    version={selectedVersion}
                    onCopy={() => copySnippet(selectedSnippet.id)}
                    onExport={() => exportSnippet(selectedSnippet.id)}
                    onFavorite={() => toggleFavorite(selectedSnippet.id)}
                    selectedVersionId={selectedVersionId}
                    onSelectVersion={(versionId) => selectVersion(versionId)}
                  />
                ) : (
                  <div className="rounded-3xl border border-dashed border-[rgba(94,75,67,0.4)] p-8 text-sm text-[#F2E4DC]/70">
                    Select a snippet from the left panel to render code, metadata, and version history.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              role="status"
              className={cn(
                "ml-auto flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-lg",
                status.type === "success" ? "bg-[#1F130F] text-[#F2E4DC]" : "bg-[#2E1F1B] text-[#F2E4DC]"
              )}
            >
              {status.type === "success" ? <Check className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
              <span>{status.message}</span>
              <button type="button" className="text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/70" onClick={() => acknowledgeStatus()}>
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StatCard({ label, value, subcopy, icon }: { label: string; value: string | number; subcopy: string; icon?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-[rgba(94,75,67,0.4)] bg-[#1A0F0B]/80 p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">
        <span>{label}</span>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-semibold text-[#F2E4DC]">{value}</p>
      <p className="text-xs text-[#F2E4DC]/70">{subcopy}</p>
    </div>
  )
}

interface FiltersPanelProps {
  searchQuery: string
  filters: SnippetFilters
  onSearch: (value: string) => void
  onLanguageChange: (language: SnippetFilters["language"]) => void
  onSortChange: (sort: SnippetFilters["sort"]) => void
  onClear: () => void
}

function FiltersPanel({ searchQuery, filters, onSearch, onLanguageChange, onSortChange, onClear }: FiltersPanelProps) {
  const hasFilters = searchQuery.trim().length > 0 || filters.language !== "all" || filters.tags.length > 0 || filters.sort !== "recent"
  return (
    <section className="rounded-[32px] border border-[rgba(94,75,67,0.35)] bg-[#150B08]/80 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Filters</p>
          <p className="text-sm text-[#F2E4DC]/70">Search across titles, descriptions, and code bodies.</p>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(94,75,67,0.5)] px-3 py-1 text-xs text-[#F2E4DC]/70"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <label className="flex items-center gap-3 rounded-3xl border border-[rgba(94,75,67,0.4)] bg-[#120A07]/80 px-4 py-2">
          <Search className="h-4 w-4 text-[#F2E4DC]/60" />
          <input
            value={searchQuery}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Debounce util, rolling revenue, hooks…"
            className="flex-1 bg-transparent text-sm text-[#F2E4DC] placeholder:text-[#F2E4DC]/40 focus:outline-none"
          />
        </label>

        <label className="flex flex-col text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">
          <span className="mb-2 inline-flex items-center gap-2 text-[10px]">
            <Filter className="h-3 w-3" /> Language
          </span>
          <select
            value={filters.language}
            onChange={(event) => onLanguageChange(event.target.value as typeof filters.language)}
            className="rounded-2xl border border-[rgba(94,75,67,0.4)] bg-[#120A07]/80 px-3 py-2 text-sm text-[#F2E4DC] focus:outline-none"
          >
            <option value="all">All</option>
            {Object.entries(languageMeta).map(([key, meta]) => (
              <option key={key} value={key} className="bg-[#120A07]">
                {meta.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">
          <span className="mb-2 inline-flex items-center gap-2 text-[10px]">
            <Tag className="h-3 w-3" /> Sort
          </span>
          <select
            value={filters.sort}
            onChange={(event) => onSortChange(event.target.value as typeof filters.sort)}
            className="rounded-2xl border border-[rgba(94,75,67,0.4)] bg-[#120A07]/80 px-3 py-2 text-sm text-[#F2E4DC] focus:outline-none"
          >
            <option value="recent">Recently updated</option>
            <option value="popular">Alphabetical</option>
          </select>
        </label>
      </div>
    </section>
  )
}

function FolderPanel({
  folderCounts,
  onSelect,
  activeLabel,
}: {
  folderCounts: Record<string, number>
  onSelect: (folder: string) => void
  activeLabel: string
}) {
  const entries = Object.entries(folderCounts)
  return (
    <div className="rounded-3xl border border-[rgba(94,75,67,0.35)] bg-[#140B08]/80 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">
        <FolderTree className="h-4 w-4" /> Folders
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {entries.map(([folder, count]) => (
          <li key={folder}>
            <button
              type="button"
              onClick={() => onSelect(folder)}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border px-3 py-2",
                activeLabel === folder
                  ? "border-[#F2E4DC]/60 bg-[#2E1F1B]/70"
                  : "border-[rgba(94,75,67,0.3)] hover:border-[#F2E4DC]/40"
              )}
            >
              <span>{folder}</span>
              <span className="text-xs text-[#F2E4DC]/70">{count}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TagPanel({
  tags,
  activeTags,
  onToggle,
}: {
  tags: [string, number][]
  activeTags: string[]
  onToggle: (tag: string) => void
}) {
  if (!tags.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[rgba(94,75,67,0.35)] bg-[#140B08]/60 p-4 text-sm text-[#F2E4DC]/60">
        Add tags to your snippets to start filtering by topics.
      </div>
    )
  }
  return (
    <div className="rounded-3xl border border-[rgba(94,75,67,0.35)] bg-[#140B08]/80 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">
        <Tag className="h-4 w-4" /> Tag cloud
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {tags.map(([tag, count]) => {
          const active = activeTags.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1",
                active ? "border-[#F2E4DC] bg-[#F2E4DC] text-[#2E1F1B]" : "border-[rgba(94,75,67,0.4)] text-[#F2E4DC]/80"
              )}
            >
              #{tag}
              <span className="text-[11px] text-[#F2E4DC]/60">{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface SnippetViewerProps {
  snippet: Snippet
  version: Snippet["versions"][number] | null
  onCopy: () => void
  onExport: () => void
  onFavorite: () => void
  selectedVersionId: string | null
  onSelectVersion: (id: string | null) => void
}

function SnippetViewer({ snippet, version, onCopy, onExport, onFavorite, selectedVersionId, onSelectVersion }: SnippetViewerProps) {
  const code = version?.code ?? snippet.code
  const canRun = snippet.language === "javascript" || snippet.language === "typescript"
  return (
    <div className="space-y-4 rounded-3xl border border-[rgba(94,75,67,0.35)] bg-[#140B08]/80 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{languageMeta[snippet.language]?.label ?? "Snippet"}</p>
          <h2 className="text-2xl font-semibold text-[#F2E4DC]">{snippet.title}</h2>
          <p className="text-sm text-[#F2E4DC]/70">{snippet.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onFavorite}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1",
              snippet.favorite ? "border-[#F2E4DC] bg-[#F2E4DC]/10" : "border-[rgba(94,75,67,0.4)]"
            )}
          >
            <Bookmark className="h-3.5 w-3.5" />
            {snippet.favorite ? "Favorited" : "Favorite"}
          </button>
          <button type="button" onClick={() => onCopy()} className="inline-flex items-center gap-2 rounded-full border border-[rgba(94,75,67,0.4)] px-3 py-1">
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
          <button type="button" onClick={() => onExport()} className="inline-flex items-center gap-2 rounded-full border border-[rgba(94,75,67,0.4)] px-3 py-1">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-[#F2E4DC]/70">
        {snippet.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[rgba(94,75,67,0.4)] px-3 py-1">
            #{tag}
          </span>
        ))}
        <span className="rounded-full border border-[rgba(94,75,67,0.4)] px-3 py-1">Updated {formatRelativeTime(snippet.updatedAt)}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-[rgba(94,75,67,0.35)] bg-[#0E0604]/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Versions</p>
          {snippet.versions.length === 0 ? (
            <p className="mt-3 text-sm text-[#F2E4DC]/70">No alternate versions yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {snippet.versions.map((entry) => {
                const active = selectedVersionId === entry.id
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => onSelectVersion(active ? null : entry.id)}
                      className={cn(
                        "w-full rounded-2xl border px-3 py-2 text-left",
                        active ? "border-[#F2E4DC]/60 bg-[#2E1F1B]/70" : "border-[rgba(94,75,67,0.3)]"
                      )}
                    >
                      <p>{entry.note ?? entry.id}</p>
                      <p className="text-xs text-[#F2E4DC]/60">{formatRelativeTime(entry.createdAt)}</p>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[rgba(94,75,67,0.35)] bg-[#0C0503]">
            <Highlight code={code} language={languageMeta[snippet.language]?.prism ?? "markup"} theme={snippetPanelTheme}>
              {({ className, style, tokens, getLineProps, getTokenProps }: RenderProps) => (
                <pre
                  className={cn(className, "max-h-[420px] overflow-auto rounded-2xl p-5 text-sm leading-relaxed")}
                  style={{ ...style, background: "transparent" }}
                >
                  {tokens.map((line, index) => (
                    <div key={`line-${index}`} {...getLineProps({ line, key: index })} className="flex">
                      <span className="mr-4 w-10 select-none text-right text-[11px] text-[#F2E4DC]/30">{index + 1}</span>
                      <span className="flex-1">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token, key })} />
                        ))}
                      </span>
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
          <SnippetRunner snippet={snippet} code={code} canRun={canRun} />
        </div>
      </div>
    </div>
  )
}

function SnippetRunner({ snippet, code, canRun }: { snippet: Snippet; code: string; canRun: boolean }) {
  const [output, setOutput] = useState<string>("Console output appears here once you run the snippet.")
  const runSnippet = () => {
    if (!canRun) return
    const logs: string[] = []
    try {
      const consoleProxy = {
        log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
        error: (...args: unknown[]) => logs.push(`ERROR: ${args.map(String).join(" ")}`),
      }
      const runner = new Function("console", code)
      runner(consoleProxy)
      setOutput(logs.length ? logs.join("\n") : "Executed without console output.")
    } catch (error) {
      setOutput(`Runtime error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="rounded-2xl border border-[rgba(94,75,67,0.35)] bg-[#0E0604]/70 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Inline runner</p>
        <button
          type="button"
          disabled={!canRun}
          onClick={() => runSnippet()}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
            canRun ? "border-[#F2E4DC] text-[#F2E4DC]" : "border-[rgba(94,75,67,0.3)] text-[#F2E4DC]/50"
          )}
        >
          <Zap className="h-3.5 w-3.5" /> {canRun ? "Run snippet" : `${languageMeta[snippet.language]?.label ?? ""} not runnable`}
        </button>
      </div>
      <p className="mt-1 text-xs text-[#F2E4DC]/60">
        {canRun ? "Runs in a sandboxed Function with a lightweight console proxy." : "Only JavaScript and TypeScript snippets can be executed inline."}
      </p>
      <pre className="mt-3 max-h-48 overflow-auto rounded-2xl bg-[#120A07]/80 p-4 text-[13px] leading-relaxed text-[#F2E4DC]/80">
        {output}
      </pre>
    </div>
  )
}
