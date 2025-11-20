import { useState, type RefObject } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { FileDown, Loader2 } from "lucide-react"
import { useBookStore } from "@/store/bookStore"
import { loadFile, parseMarkdown, sanitizeHtml } from "@/utils/bookUtils"

interface ExportPDFProps {
  targetRef: RefObject<HTMLDivElement | null>
}

export function ExportPDF({ targetRef }: ExportPDFProps) {
  const chapters = useBookStore((state) => state.chapters)
  const currentChapterSlug = useBookStore((state) => state.currentChapterSlug)
  const chapterHtml = useBookStore((state) => state.chapterHtml)
  const setChapterHtml = useBookStore((state) => state.setChapterHtml)
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const currentChapter = chapters.find((chapter) => chapter.slug === currentChapterSlug)

  const handleExportChapter = async () => {
    if (!currentChapter) {
      setError("Select a chapter before exporting.")
      return
    }
    if (!targetRef.current) {
      fallbackPrint(currentChapter.title, chapterHtml[currentChapter.slug])
      return
    }

    setIsExporting(true)
    setError(null)
    setProgress("Preparing chapter…")
    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: "#2E1F1B",
        scale: window.devicePixelRatio || 1.5,
        useCORS: true,
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "pt", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = (canvas.height * pageWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight)
      pdf.save(`${currentChapter.slug}.pdf`)
      setProgress("Export complete")
    } catch (exportError) {
      console.error(exportError)
      setError("Export failed. Try the print fallback below.")
    } finally {
      setIsExporting(false)
      setTimeout(() => setProgress(null), 2000)
    }
  }

  const handleExportBook = async () => {
    if (!chapters.length) {
      setError("No chapters available to export.")
      return
    }
    setShowConfirm(false)
    setIsExporting(true)
    setError(null)
    const pdf = new jsPDF("p", "pt", "a4")
    let encounteredError = false

    for (let index = 0; index < chapters.length; index += 1) {
      const chapter = chapters[index]
      setProgress(`Rendering ${chapter.title} (${index + 1}/${chapters.length})`)
      try {
        const html = await ensureChapterHtml(chapter.slug, chapter.file)
        const canvas = await renderHtmlToCanvas(html)
        const imgData = canvas.toDataURL("image/png")
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = (canvas.height * pageWidth) / canvas.width

        if (index > 0) {
          pdf.addPage()
        }
        pdf.setFontSize(18)
        pdf.text(chapter.title, 32, 48)
        pdf.addImage(imgData, "PNG", 0, 64, pageWidth, pageHeight)
      } catch (renderError) {
        console.error(renderError)
        setError(`Failed to render ${chapter.title}. Aborting export.`)
        encounteredError = true
        break
      }
    }

    if (!encounteredError) {
      pdf.save("book-portfolio.pdf")
      setProgress("Full book exported")
    }

    setIsExporting(false)
    setTimeout(() => setProgress(null), 2500)
  }

  const ensureChapterHtml = async (slug: string, file: string) => {
    if (chapterHtml[slug]) {
      return chapterHtml[slug]
    }
    const raw = await loadFile(file)
    const html = file.endsWith(".md") ? parseMarkdown(raw) : raw
    const safe = sanitizeHtml(html)
    setChapterHtml(slug, safe)
    return safe
  }

  const renderHtmlToCanvas = async (html: string) => {
    const stage = document.createElement("div")
    stage.style.position = "fixed"
    stage.style.left = "-9999px"
    stage.style.top = "0"
    stage.style.width = "794px"
    stage.style.padding = "24px"
    stage.style.background = "#2E1F1B"
    stage.style.color = "#F7E6D4"
    stage.className = "prose prose-invert"
    stage.innerHTML = html
    document.body.appendChild(stage)
    const canvas = await html2canvas(stage, {
      backgroundColor: "#2E1F1B",
      scale: window.devicePixelRatio || 1.5,
      useCORS: true,
    })
    document.body.removeChild(stage)
    return canvas
  }

  const fallbackPrint = (title: string, html?: string) => {
    if (typeof window === "undefined") return
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      setError("Popup blocked. Allow popups or use browser print.")
      return
    }
    const safeHtml = html ?? "<p>Visit the Book view to load this chapter, then try again.</p>"
    printWindow.document.write(`<!doctype html><html><head><title>${title}</title></head><body>${safeHtml}</body></html>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className="flex flex-col gap-2 text-[#F7E6D4]">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExportChapter}
          disabled={isExporting}
          className="inline-flex items-center gap-2 rounded-full border border-[#5E4B43]/70 px-4 py-2 text-sm font-medium transition hover:bg-[#5E4B43]/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
          Export chapter
        </button>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isExporting}
          className="inline-flex items-center gap-2 rounded-full border border-[#5E4B43]/40 px-4 py-2 text-sm text-[#F7E6D4]/80 transition hover:border-[#F7E6D4]/60"
        >
          Full book PDF
        </button>
        <button
          type="button"
          onClick={() => currentChapter && fallbackPrint(currentChapter.title, chapterHtml[currentChapter.slug])}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-[#F7E6D4]/50 px-4 py-2 text-sm text-[#F7E6D4]/70 hover:text-[#F7E6D4]"
        >
          Print fallback
        </button>
      </div>

      {progress && <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">{progress}</p>}
      {error && <p className="text-sm text-[#F28A8A]">{error}</p>}

      {showConfirm && (
        <div className="mt-2 rounded-2xl border border-[#5E4B43]/60 bg-[#2E1F1B]/90 p-4 text-sm">
          <p className="font-medium text-[#F7E6D4]">Export entire book?</p>
          <p className="mt-1 text-[#F7E6D4]/70">
            This may take a moment for {chapters.length} chapters. Continue?
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleExportBook}
              className="rounded-full border border-[#F7E6D4]/60 px-3 py-1"
            >
              Yes, export
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="rounded-full border border-transparent px-3 py-1 text-[#F7E6D4]/70"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
