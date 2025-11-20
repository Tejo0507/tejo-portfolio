import { motion, useReducedMotion } from "framer-motion"
import { Bookmark, BookmarkCheck, Eye, FileDown, Layers } from "lucide-react"
import { useState } from "react"
import type { Material } from "@/types/materials"
import { useMaterialsStore } from "@/store/materialsStore"
import { getDriveDownloadUrl } from "@/utils/driveUtils"
import { cn } from "@/utils"

interface MaterialCardProps {
  material: Material
  onView: (material: Material) => void
}

export function MaterialCard({ material, onView }: MaterialCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const toggleBookmark = useMaterialsStore((state) => state.toggleBookmark)
  const bookmarks = useMaterialsStore((state) => state.bookmarks)
  
  const [toastVisible, setToastVisible] = useState(false)
  const isBookmarked = bookmarks.includes(material.id)

  const handleBookmark = () => {
    toggleBookmark(material.id)
    setToastVisible(true)
    window.setTimeout(() => setToastVisible(false), 1600)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex flex-col rounded-3xl border border-[#5E4B43]/40 bg-[#2E1F1B]/70 p-5 text-[#F7E6D4] shadow-xl shadow-[#2E1F1B]/40",
        material.archived && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">{material.subject}</p>
          <h3 className="text-lg font-semibold">{material.title}</h3>
        </div>
        <button
          type="button"
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark material"}
          onClick={handleBookmark}
          className={cn(
            "rounded-full border px-3 py-2 text-sm",
            isBookmarked ? "border-[#F7E6D4]/70 bg-[#5E4B43]/70" : "border-[#5E4B43]/60 hover:border-[#F7E6D4]/60"
          )}
        >
          {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>

      <p className="mt-3 text-sm text-[#F7E6D4]/80">{material.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-[#5E4B43]/40 px-3 py-1">{material.semester}</span>
        <span className="rounded-full border border-[#5E4B43]/40 px-3 py-1">{material.fileType}</span>
        {material.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[#5E4B43]/30 px-3 py-1 text-[#F7E6D4]/80">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => onView(material)}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#5E4B43]/60 px-3 py-2 text-[#F7E6D4] transition hover:bg-[#5E4B43]/40"
        >
          <Eye className="h-4 w-4" /> View
        </button>
        <a
          href={material.driveId ? getDriveDownloadUrl(material.driveId) : material.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-[#5E4B43]/40 px-3 py-2 text-[#F7E6D4]/80 transition hover:text-[#F7E6D4]"
        >
          <FileDown className="h-4 w-4" /> Download
        </a>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#5E4B43]/40 px-3 py-1 text-xs text-[#F7E6D4]/70">
          <Layers className="h-3 w-3" /> {material.versions.length} version{material.versions.length === 1 ? "" : "s"}
        </span>
      </div>

      {toastVisible && (
        <div className="pointer-events-none absolute inset-x-0 top-2 mx-auto w-fit rounded-full border border-[#F7E6D4]/40 bg-[#5E4B43]/80 px-4 py-1 text-xs text-[#F7E6D4] shadow-lg">
          {isBookmarked ? "Saved for later" : "Removed bookmark"}
        </div>
      )}
    </motion.article>
  )
}
