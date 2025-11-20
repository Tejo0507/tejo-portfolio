import { motion, useReducedMotion } from "framer-motion"
import { Link } from "react-router-dom"
import type { ProjectRecord } from "@/data/projects"
import { useProjectStore } from "@/store/projectStore"

interface ProjectCardProps {
  project: ProjectRecord
  viewMode?: "grid" | "list"
}

export default function ProjectCard({ project, viewMode = "grid" }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const compareList = useProjectStore((state) => state.compareList)
  const toggleCompare = useProjectStore((state) => state.toggleCompare)

  const isCompared = compareList.includes(project.id)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.45, 0.05, 0.25, 0.95] }}
      className={[
        "group flex gap-4 rounded-2xl border border-medium/15 bg-dark/60 p-5 shadow-soft transition-shadow duration-smooth ease-smooth",
        viewMode === "list" ? "flex-row" : "flex-col",
      ].join(" ")}
    >
      <div className={viewMode === "list" ? "w-40 shrink-0" : "w-full"}>
        <div className="overflow-hidden rounded-xl border border-medium/20 bg-dark/70">
          <img
            src={project.images[0] ?? "/assets/placeholder.png"}
            alt={`${project.title} preview`}
            className="h-32 w-full object-cover transition-transform duration-smooth ease-smooth group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-medium/25 px-3 py-1 text-xs uppercase tracking-[0.3em] text-medium/70">
            {project.year}
          </span>
          <span className="rounded-full border border-medium/25 px-3 py-1 text-xs text-medium/80">
            {project.difficulty}
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-medium">{project.title}</h3>
        <p className="text-sm text-medium/80">{project.summary}</p>

        <div className="flex flex-wrap gap-2" role="list">
          {project.tech.map((tech) => (
            <span
              key={tech}
              role="listitem"
              className="rounded-lg border border-medium/20 px-2 py-1 text-xs text-medium/70"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            to={`/projects/${project.id}`}
            className="rounded-xl border border-medium/30 px-4 py-2 text-sm font-semibold text-medium transition-colors duration-smooth ease-smooth hover:bg-dark/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium/60"
          >
            View project
          </Link>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-medium/30 px-4 py-2 text-sm text-medium/80 transition-colors duration-smooth ease-smooth hover:bg-dark/70"
            >
              Repo
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-medium/30 px-4 py-2 text-sm text-medium/80 transition-colors duration-smooth ease-smooth hover:bg-dark/70"
            >
              Live
            </a>
          )}
          <button
            type="button"
            onClick={() => toggleCompare(project.id)}
            aria-pressed={isCompared}
            className={[
              "rounded-xl border px-4 py-2 text-sm transition-colors duration-smooth ease-smooth",
              isCompared
                ? "border-medium bg-medium/20 text-medium"
                : "border-medium/30 text-medium/80 hover:bg-dark/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium/60",
            ].join(" ")}
          >
            {isCompared ? "Added" : "Add to compare"}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
