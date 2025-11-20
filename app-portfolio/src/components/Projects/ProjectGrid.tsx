import { useState } from "react"
import { motion } from "framer-motion"
import type { ProjectRecord } from "@/data/projects"
import ProjectCard from "./ProjectCard"

interface ProjectGridProps {
  projects: ProjectRecord[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <section aria-labelledby="project-grid" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="project-grid" className="text-2xl font-semibold text-medium">
          {projects.length} projects
        </h2>
        <div className="inline-flex rounded-full border border-medium/25 p-1 text-sm text-medium">
          {(["grid", "list"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={[
                "rounded-full px-3 py-1 transition-colors duration-smooth ease-smooth",
                viewMode === mode ? "bg-medium text-dark" : "text-medium/70",
              ].join(" ")}
            >
              {mode === "grid" ? "Grid" : "List"}
            </button>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="rounded-2xl border border-medium/20 bg-dark/60 p-6 text-medium/70">No projects match these filters.</p>
      ) : viewMode === "grid" ? (
        <motion.div
          className="grid gap-5 md:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.45, 0.05, 0.25, 0.95] }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} viewMode="grid" />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.45, 0.05, 0.25, 0.95] }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} viewMode="list" />
          ))}
        </motion.div>
      )}
    </section>
  )
}
