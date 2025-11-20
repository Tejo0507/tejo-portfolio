import { motion } from "framer-motion"
import type { ProjectRecord } from "@/data/projects"

interface ProjectTimelineProps {
  projects: ProjectRecord[]
  selectedYear: number | null
  onSelectYear: (year: number | null) => void
}

export default function ProjectTimeline({ projects, selectedYear, onSelectYear }: ProjectTimelineProps) {
  const groups = projects.reduce<Record<number, ProjectRecord[]>>((acc, project) => {
    acc[project.year] = acc[project.year] ? [...acc[project.year], project] : [project]
    return acc
  }, {})

  const orderedYears = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <section aria-labelledby="project-timeline" className="space-y-4 rounded-2xl border border-medium/15 bg-dark/60 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 id="project-timeline" className="text-xl font-semibold text-medium">
          Timeline
        </h2>
        <button
          type="button"
          onClick={() => onSelectYear(null)}
          className="text-xs uppercase tracking-[0.3em] text-medium/70 hover:text-medium"
        >
          Reset
        </button>
      </div>
      <ol className="space-y-3" role="list">
        {orderedYears.map((year) => (
          <li key={year} role="listitem">
            <motion.button
              type="button"
              onClick={() => onSelectYear(year === selectedYear ? null : year)}
              className={[
                "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors duration-smooth ease-smooth",
                year === selectedYear ? "border-medium bg-medium/15 text-medium" : "border-medium/20 text-medium/80 hover:border-medium/50",
              ].join(" ")}
              whileHover={{ x: 4 }}
            >
              <span className="text-lg font-semibold">{year}</span>
              <span className="text-xs uppercase tracking-[0.3em] text-medium/60">{groups[year].length} projects</span>
            </motion.button>
          </li>
        ))}
      </ol>
    </section>
  )
}
