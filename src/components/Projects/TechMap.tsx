import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import type { ProjectRecord } from "@/data/projects"

interface TechMapProps {
  projects: ProjectRecord[]
}

export default function TechMap({ projects }: TechMapProps) {
  const [activeTech, setActiveTech] = useState<string | null>(null)

  const map = useMemo(() => {
    const result: Record<string, ProjectRecord[]> = {}
    projects.forEach((project) => {
      project.tech.forEach((tech) => {
        result[tech] = result[tech] ? [...result[tech], project] : [project]
      })
    })
    return result
  }, [projects])

  const techList = Object.keys(map).sort()

  return (
    <section aria-labelledby="tech-map" className="space-y-4 rounded-2xl border border-medium/15 bg-dark/60 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 id="tech-map" className="text-xl font-semibold text-medium">
          Tech map
        </h2>
        <span className="text-xs uppercase tracking-[0.3em] text-medium/70">hover to highlight</span>
      </div>

      <div className="flex flex-wrap gap-3" role="list">
        {techList.map((tech) => (
          <motion.button
            key={tech}
            type="button"
            role="listitem"
            onMouseEnter={() => setActiveTech(tech)}
            onFocus={() => setActiveTech(tech)}
            onMouseLeave={() => setActiveTech(null)}
            onBlur={() => setActiveTech(null)}
            className={[
              "rounded-full border px-3 py-1 text-sm transition-colors duration-smooth ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium/60",
              activeTech === tech ? "border-medium bg-medium/20 text-medium" : "border-medium/20 text-medium/80 hover:border-medium/50",
            ].join(" ")}
            whileHover={{ y: -2 }}
          >
            {tech}
          </motion.button>
        ))}
      </div>

      <div className="min-h-[120px] rounded-2xl border border-medium/15 bg-dark/70 p-4">
        {activeTech ? (
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-medium/70">Projects using {activeTech}</p>
            <ul className="mt-2 space-y-1 text-sm text-medium">
              {map[activeTech].map((project) => (
                <li key={project.id}>{project.title}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-medium/70">Hover a tech chip to see connected builds.</p>
        )}
      </div>
    </section>
  )
}
