import { motion } from "framer-motion"
import type { ProjectRecord } from "@/data/projects"
import FolderTree from "./FolderTree"

interface DevModeViewProps {
  project: ProjectRecord
  onClose: () => void
}

export default function DevModeView({ project, onClose }: DevModeViewProps) {
  return (
    <motion.div
      role="dialog"
      aria-label="Developer mode"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-4xl rounded-2xl border border-medium/20 bg-dark/95 p-6 text-medium shadow-depth"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.45, 0.05, 0.25, 0.95] }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-medium/70">Dev mode</p>
            <h2 className="text-2xl font-semibold">{project.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-medium/30 px-4 py-2 text-sm text-medium transition-colors duration-smooth ease-smooth hover:bg-dark/70"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-medium/70">Architecture notes</p>
            <p className="mt-3 text-sm text-medium/80">{project.details.architecture}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-medium/80">
              {project.details.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="mt-4 flex gap-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-medium/30 px-3 py-2 text-sm text-medium/80 transition-colors duration-smooth ease-smooth hover:bg-dark/70"
                >
                  Download repo
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  if (project.folderStructure) {
                    const data = JSON.stringify(project.folderStructure, null, 2)
                    const blob = new Blob([data], { type: "application/json" })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement("a")
                    link.href = url
                    link.download = `${project.id}-structure.json`
                    link.click()
                    URL.revokeObjectURL(url)
                  }
                }}
                className="rounded-xl border border-medium/30 px-3 py-2 text-sm text-medium/80 transition-colors duration-smooth ease-smooth hover:bg-dark/70"
              >
                Export tree
              </button>
            </div>
          </div>

          <div className="max-h-[360px] overflow-auto rounded-2xl border border-medium/20 bg-dark/80 p-3">
            {project.folderStructure ? (
              <FolderTree root={project.folderStructure} />
            ) : (
              <p className="text-sm text-medium/70">No folder structure documented yet.</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
