import DOMPurify from "dompurify"
import { marked } from "marked"

const BASE_PATH = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")
const BOOK_ROOT = `${BASE_PATH}/book-portfolio`
export const DEFAULT_CHARS_PER_PAGE = 1400

function withBasePath(filePath: string): string {
  if (/^https?:/i.test(filePath)) {
    return filePath
  }
  const normalized = filePath.replace(/^\//, "")
  if (normalized.startsWith("book-portfolio/")) {
    return `${BASE_PATH}/${normalized}`
  }
  return `${BOOK_ROOT}/${normalized}`
}

export async function loadFile(filePath: string, signal?: AbortSignal): Promise<string> {
  const target = withBasePath(filePath)
  const response = await fetch(target, { signal })
  if (!response.ok) {
    throw new Error(`Failed to load ${filePath}: ${response.status}`)
  }
  return response.text()
}

export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown, {
    gfm: true,
    breaks: true,
  }) as string
}

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    return html
  }
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  })
}

export function getTextExcerpt(html: string, start = 0, length = 140): string {
  if (!html) {
    return ""
  }
  const text = extractPlainText(html)
  const trimmedStart = Math.max(0, start)
  const slice = text.slice(trimmedStart, trimmedStart + length)
  return slice.trim()
}

export function extractPlainText(html: string): string {
  if (!html) {
    return ""
  }
  if (typeof document !== "undefined") {
    const temp = document.createElement("div")
    temp.innerHTML = html
    return (temp.textContent ?? temp.innerText ?? "").replace(/\s+/g, " ").trim()
  }
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}
