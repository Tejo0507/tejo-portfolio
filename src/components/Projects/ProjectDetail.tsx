import { lazy, Suspense, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useProjectStore } from "@/store/projectStore"

const DevModeView = lazy(() => import("./DevModeView"))

export default function ProjectDetail() {
  const params = useParams<{ id: string }>()
  const projectId = params.id ?? ""
  const projects = useProjectStore((state) => state.projects)
  const setDevMode = useProjectStore((state) => state.setDevMode)
  const devMode = useProjectStore((state) => state.devMode)
  const selectProject = useProjectStore((state) => state.selectProject)
  const project = projects.find((item) => item.id === projectId) ?? null

  const timelineDots = useMemo(() => project?.details.highlights ?? [], [project])

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-medium">
        <p className="text-lg">Project not found.</p>
        <Link to="/projects" className="mt-4 inline-flex rounded-xl border border-medium/30 px-4 py-2 text-sm text-medium/80">
          Back to projects
        </Link>
      </main>
    )
  }

  const openDevMode = () => {
    selectProject(project.id)
    setDevMode(true)
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-dark via-dark/95 to-dark text-medium">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(94,75,67,0.15),_transparent_55%)]" aria-hidden />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
        <header className="space-y-4">
          <Link to="/projects" className="text-xs uppercase tracking-[0.3em] text-medium/70">← Projects</Link>
          <h1 className="text-4xl font-semibold leading-tight">{project.title}</h1>
          <p className="text-base text-medium/80">{project.details.description}</p>
          <div className="flex flex-wrap gap-3 text-sm text-medium/70">
            <span className="rounded-full border border-medium/25 px-3 py-1">{project.year}</span>
            <span className="rounded-full border border-medium/25 px-3 py-1">{project.difficulty}</span>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-medium/30 px-3 py-1 text-medium/80 hover:bg-dark/60"
              >
                Live
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-medium/30 px-3 py-1 text-medium/80 hover:bg-dark/60"
              >
                Repo
              </a>
            )}
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {project.images.map((image) => (
            <motion.div key={image} className="overflow-hidden rounded-2xl border border-medium/15" whileHover={{ scale: 1.01 }}>
              <img src={image} alt={`${project.title} screen`} loading="lazy" className="h-64 w-full object-cover" />
            </motion.div>
          ))}
        </section>

        <section className="rounded-2xl border border-medium/15 bg-dark/60 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-medium/70">Tech stack</p>
          <div className="mt-3 flex flex-wrap gap-3" role="list">
            {project.tech.map((tech) => (
              <span key={tech} role="listitem" className="rounded-xl border border-medium/20 px-4 py-2 text-sm text-medium/80">
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-medium/15 bg-dark/60 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-medium/70">Highlights</p>
          <div className="mt-4 space-y-3">
            {timelineDots.map((point, index) => (
              <div key={point} className="flex items-start gap-3">
                <span className="mt-1 h-3 w-3 rounded-full bg-medium" aria-hidden />
                <p className="text-sm text-medium/80">{point}</p>
                <span className="text-xs text-medium/60">Milestone {index + 1}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={openDevMode}
            className="mt-4 rounded-xl border border-medium/30 px-4 py-2 text-sm text-medium transition-colors duration-smooth ease-smooth hover:bg-dark/70"
          >
            Toggle Dev Mode
          </button>
        </section>
      </div>

      {devMode && (
        <Suspense fallback={<div className="fixed inset-0 z-50 grid place-items-center text-medium">Loading dev mode...</div>}>
          <DevModeView
            project={project}
            onClose={() => {
              setDevMode(false)
              selectProject(null)
            }}
          />
        </Suspense>
      )}
    </main>
  )
}
