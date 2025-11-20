import { saveAs } from "file-saver"
import JSZip from "jszip"
import type { Language, PrismTheme } from "prism-react-renderer"
import type { LanguageId, Snippet, SnippetFilters, SnippetVersion } from "@/types/snippet"

const twoToneBase = "#2E1F1B"
const accent = "#5E4B43"

export const languageMeta: Record<LanguageId, { label: string; extension: string; prism: Language }> = {
  typescript: { label: "TypeScript", extension: "ts", prism: "tsx" },
  javascript: { label: "JavaScript", extension: "js", prism: "javascript" },
  python: { label: "Python", extension: "py", prism: "python" },
  java: { label: "Java", extension: "java", prism: "java" },
  sql: { label: "SQL", extension: "sql", prism: "sql" },
  css: { label: "CSS", extension: "css", prism: "css" },
  bash: { label: "Bash", extension: "sh", prism: "bash" },
  go: { label: "Go", extension: "go", prism: "go" },
  rust: { label: "Rust", extension: "rs", prism: "rust" },
  other: { label: "Snippet", extension: "txt", prism: "markup" },
}

export const snippetPanelTheme: PrismTheme = {
  plain: {
    color: "#F2E4DC",
    backgroundColor: twoToneBase,
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
  style: { color: "rgba(94,75,67,0.65)", fontStyle: "italic" as const },
    },
    {
      types: ["punctuation"],
      style: { color: "rgba(242,228,220,0.7)" },
    },
    {
      types: ["property", "tag", "constant", "symbol"],
      style: { color: "rgba(197,161,146,1)" },
    },
    {
      types: ["boolean", "number"],
      style: { color: accent },
    },
    {
      types: ["function", "class-name"],
      style: { color: "rgba(255,230,214,0.9)" },
    },
    {
      types: ["string", "attr-name"],
      style: { color: "rgba(222,190,176,1)" },
    },
    {
      types: ["operator", "entity", "url"],
      style: { color: "rgba(219,197,180,0.8)" },
    },
  ],
}

export function buildTagCounts(snippets: Snippet[]): Record<string, number> {
  return snippets.reduce<Record<string, number>>((counts, snippet) => {
    snippet.tags.forEach((tag) => {
      const key = tag.toLowerCase()
      counts[key] = (counts[key] ?? 0) + 1
    })
    return counts
  }, {})
}

export function filterSnippets(snippets: Snippet[], query: string, filters: SnippetFilters) {
  const needle = query.trim().toLowerCase()
  const activeTags = new Set(filters.tags.map((tag) => tag.toLowerCase()))
  return [...snippets]
    .filter((snippet) => {
      if (filters.language !== "all" && snippet.language !== filters.language) return false
      if (activeTags.size) {
        const hasEveryTag = Array.from(activeTags).every((tag) => snippet.tags.some((value) => value.toLowerCase() === tag))
        if (!hasEveryTag) return false
      }
      if (!needle) return true
      const haystack = `${snippet.title} ${snippet.description} ${snippet.tags.join(" ")} ${snippet.code}`.toLowerCase()
      return haystack.includes(needle)
    })
    .sort((first, second) => {
      if (filters.sort === "recent") {
        return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
      }
      return first.title.localeCompare(second.title)
    })
}

export function ensureExtension(language: LanguageId) {
  return languageMeta[language]?.extension ?? "txt"
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

export async function copySnippetToClipboard(code: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(code)
    return true
  }
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea")
    textarea.value = code
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
    return true
  }
  return false
}

function buildSnippetHeader(snippet: Snippet, version?: SnippetVersion) {
  const lines = [
    `// ${snippet.title}`,
    `// Author: ${snippet.author}`,
    `// Updated: ${new Date(version?.createdAt ?? snippet.updatedAt).toLocaleString()}`,
  ]
  return `${lines.join("\n")}\n\n${version?.code ?? snippet.code}`
}

export function downloadSnippet(snippet: Snippet, version?: SnippetVersion) {
  const header = buildSnippetHeader(snippet, version)
  const extension = ensureExtension(snippet.language)
  const blob = new Blob([header], { type: "text/plain;charset=utf-8" })
  const fileName = `${slugify(snippet.title || snippet.id)}.${extension}`
  saveAs(blob, fileName)
}

export async function exportSnippetsZip(snippets: Snippet[]) {
  const zip = new JSZip()
  snippets.forEach((snippet) => {
    const extension = ensureExtension(snippet.language)
    const fileName = `${slugify(snippet.title || snippet.id)}.${extension}`
    zip.file(fileName, buildSnippetHeader(snippet))
  })
  const blob = await zip.generateAsync({ type: "blob" })
  saveAs(blob, `snippets-bundle-${Date.now()}.zip`)
}

export function formatRelativeTime(dateIso: string) {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const diff = Date.now() - new Date(dateIso).getTime()
  const minutes = Math.round(diff / 60000)
  if (Math.abs(minutes) < 60) return formatter.format(-minutes, "minute")
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return formatter.format(-hours, "hour")
  const days = Math.round(hours / 24)
  if (Math.abs(days) < 30) return formatter.format(-days, "day")
  const months = Math.round(days / 30)
  return formatter.format(-months, "month")
}

export function deriveFolderCounts(snippets: Snippet[]) {
  return snippets.reduce<Record<string, number>>((acc, snippet) => {
    const key = snippet.folderId ?? "Ungrouped"
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
}

export function describeSnippet(snippet: Snippet) {
  const lang = languageMeta[snippet.language]?.label ?? "Snippet"
  return `${snippet.title} • ${lang} • ${snippet.tags.join(", ")}`
}
