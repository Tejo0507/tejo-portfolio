import { useMemo } from "react"
import { motion } from "framer-motion"
import { useProjectStore } from "@/store/projectStore"

export default function CompareProjects() {
  const compareList = useProjectStore((state) => state.compareList)
  const projects = useProjectStore((state) => state.projects)
  const toggleCompare = useProjectStore((state) => state.toggleCompare)

  const compared = useMemo(() => projects.filter((project) => compareList.includes(project.id)), [projects, compareList])

  const handleExport = () => {
    window.print()
  }

  return (
    <section aria-labelledby="compare-projects" className="space-y-4 rounded-2xl border border-medium/15 bg-dark/60 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 id="compare-projects" className="text-xl font-semibold text-medium">
          Compare ({compared.length}/3)
        </h2>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-xl border border-medium/30 px-3 py-1 text-xs uppercase tracking-[0.3em] text-medium/80 transition-colors duration-smooth ease-smooth hover:bg-dark/70"
        >
          Export view
        </button>
      </div>

      {compared.length === 0 ? (
        <p className="text-sm text-medium/70">Add projects to compare for a side-by-side snapshot.</p>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compared.length}, minmax(0, 1fr))` }}>
          {compared.map((project) => (
            <motion.article
              key={project.id}
              className="rounded-2xl border border-medium/20 bg-dark/70 p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.45, 0.05, 0.25, 0.95] }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-medium">{project.title}</h3>
                <button
                  type="button"
                  onClick={() => toggleCompare(project.id)}
                  aria-label={`Remove ${project.title} from compare`}
                  className="text-xs uppercase tracking-[0.3em] text-medium/60 hover:text-medium"
                >
                  Remove
                </button>
              </div>
              <p className="mt-1 text-sm text-medium/80">{project.summary}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-medium/60">{project.year}</p>
              <p className="text-xs text-medium/70">{project.difficulty}</p>
              <div className="mt-3 space-y-1 text-sm text-medium/80">
                <p className="font-semibold">Tech</p>
                <ul className="list-disc pl-5">
                  {project.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  )
}
