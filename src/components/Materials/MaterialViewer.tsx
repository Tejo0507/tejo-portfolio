import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Download, ExternalLink, ShieldAlert } from "lucide-react"
import type { Material, MaterialVersion } from "@/types/materials"
import { getDriveDownloadUrl, getDrivePreviewUrl, getEmbeddableUrl } from "@/utils/driveUtils"
import { VersionHistory } from "./VersionHistory"
import { NotesPanel } from "./NotesPanel"

interface MaterialViewerProps {
  material: Material
  onClose: () => void
}

export function MaterialViewer({ material, onClose }: MaterialViewerProps) {
  const [activeVersionId, setActiveVersionId] = useState(material.versions[0]?.id ?? null)
  const activeVersion = useMemo(() => material.versions.find((version) => version.id === activeVersionId) ?? material.versions[0], [
    material.versions,
    activeVersionId,
  ])

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 180, damping: 24 }}
      className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl overflow-y-auto border-l border-[#5E4B43]/40 bg-[#1E1410] text-[#F7E6D4] shadow-2xl"
      aria-label="Material viewer"
    >
      <div className="flex items-center justify-between border-b border-[#5E4B43]/30 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">{material.subject}</p>
          <h2 className="text-xl font-semibold">{material.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-[#5E4B43]/60 px-4 py-2 text-sm text-[#F7E6D4]/80 hover:text-[#F7E6D4]"
        >
          Close
        </button>
      </div>

      <div className="space-y-6 p-6">
        <ViewerFrame material={material} version={activeVersion} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-[#5E4B43]/40 bg-[#2E1F1B]/70 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F7E6D4]/70">Metadata</h3>
            <dl className="mt-3 space-y-2 text-sm text-[#F7E6D4]/80">
              <div className="flex justify-between"><dt>Semester</dt><dd>{material.semester}</dd></div>
              <div className="flex justify-between"><dt>Type</dt><dd>{material.fileType}</dd></div>
              <div className="flex justify-between"><dt>Uploaded by</dt><dd>{material.uploadedBy}</dd></div>
              <div className="flex justify-between"><dt>Updated</dt><dd>{new Date(material.updatedAt).toLocaleString()}</dd></div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {material.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#5E4B43]/40 px-3 py-1 text-[#F7E6D4]/80">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a
                href={material.driveId ? getDrivePreviewUrl(material.driveId) : material.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#5E4B43]/60 px-3 py-2"
              >
                <ExternalLink className="h-4 w-4" /> Open in new tab
              </a>
              <a
                href={material.driveId ? getDriveDownloadUrl(material.driveId) : material.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#5E4B43]/40 px-3 py-2 text-[#F7E6D4]/80 hover:text-[#F7E6D4]"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </div>
          </div>

          <NotesPanel key={material.id} materialId={material.id} />
        </div>

        <VersionHistory
          material={material}
          activeVersionId={activeVersion?.id ?? null}
          onSelectVersion={(versionId: string) => setActiveVersionId(versionId)}
        />
      </div>
    </motion.aside>
  )
}

function ViewerFrame({ material, version }: { material: Material; version?: MaterialVersion }) {
  if (!version) {
    return (
      <div className="rounded-3xl border border-dashed border-[#5E4B43]/40 bg-[#2E1F1B]/60 p-8 text-center text-sm text-[#F7E6D4]/70">
        No version selected.
      </div>
    )
  }

  const previewSrc = getEmbeddableUrl(material.driveId, version.fileUrl)

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-[#5E4B43]/50 bg-[#0F0805] p-4 shadow-inner shadow-[#2E1F1B]/70">
        {renderEmbed(version.fileType, previewSrc, version.fileUrl)}
      </div>
      <p className="text-xs text-[#F7E6D4]/60">
        <ShieldAlert className="mr-1 inline h-3 w-3" /> Embedding works only when the Drive file is publicly shareable. Private files
        will require the "Open in new tab" button due to cross-origin protections.
      </p>
    </div>
  )
}

function renderEmbed(fileType: MaterialVersion["fileType"], previewSrc: string, fallback: string) {
  if (fileType === "video") {
    return (
      <video controls className="aspect-video w-full rounded-2xl" src={fallback}>
        <track kind="captions" />
      </video>
    )
  }

  if (fileType === "pdf") {
    return (
      <embed
        src={previewSrc || fallback}
        type="application/pdf"
        className="h-[480px] w-full rounded-2xl"
      />
    )
  }

  if (fileType === "google-doc" || fileType === "google-slide" || fileType === "sheet" || fileType === "ppt" || fileType === "doc") {
    return (
      <iframe
        title="Document preview"
        src={previewSrc}
        className="h-[520px] w-full rounded-2xl border-none"
        allow="fullscreen"
      />
    )
  }

  return (
    <div className="flex h-[320px] flex-col items-center justify-center text-center text-sm text-[#F7E6D4]/70">
      <p>Preview unavailable for this file type.</p>
      <a
        href={fallback}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-[#5E4B43]/60 px-3 py-2 text-[#F7E6D4]"
      >
        Open externally <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  )
}
