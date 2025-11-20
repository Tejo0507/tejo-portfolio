import { MainLayout } from "@/layouts"
import { projects } from "@/data"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Github, ExternalLink, Calendar } from "lucide-react"
import { useState } from "react"

const difficultyColors = {
  Beginner: "text-green-400",
  Intermediate: "text-yellow-400",
  Advanced: "text-red-400",
}

export default function ProjectList() {
  const [filter, setFilter] = useState<string>("all")
  
  const allTechs = Array.from(new Set(projects.flatMap(p => p.tech)))
  
  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.tech.includes(filter))

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-dark via-dark/95 to-dark text-medium">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(94,75,67,0.15),_transparent_55%)]" aria-hidden />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.45, 0.05, 0.25, 0.95] }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-medium/70">Portfolio</p>
              <h1 className="text-4xl font-semibold leading-tight text-medium">My Projects</h1>
            </div>
            <p className="max-w-3xl text-base text-medium/80">
              A collection of AI/ML projects, web applications, and experiments showcasing my skills in machine learning, computer vision, and full-stack development.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-medium/20 text-medium"
                    : "bg-dark/40 text-medium/60 hover:bg-dark/60 hover:text-medium/80"
                }`}
              >
                All Projects
              </button>
              {allTechs.slice(0, 8).map((tech) => (
                <button
                  key={tech}
                  onClick={() => setFilter(tech)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    filter === tech
                      ? "bg-medium/20 text-medium"
                      : "bg-dark/40 text-medium/60 hover:bg-dark/60 hover:text-medium/80"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </motion.header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-medium/10 bg-dark/40 p-6 transition-all duration-smooth hover:border-medium/30 hover:bg-dark/60"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-semibold text-medium group-hover:text-medium/90">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-medium/60">
                        <Calendar className="h-3 w-3" />
                        <span>{project.year}</span>
                        <span className="mx-1">•</span>
                        <span className={difficultyColors[project.difficulty]}>
                          {project.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="flex-1 text-sm text-medium/70 leading-relaxed">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-medium/10 px-3 py-1 text-xs font-medium text-medium/80"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="rounded-full bg-medium/10 px-3 py-1 text-xs font-medium text-medium/80">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-medium/70 transition-colors hover:text-medium"
                      >
                        <Github className="h-4 w-4" />
                        <span>Code</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-medium/70 transition-colors hover:text-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Live</span>
                      </a>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <p className="text-lg text-medium/60">No projects found with this filter.</p>
              <button
                onClick={() => setFilter("all")}
                className="rounded-lg bg-medium/20 px-6 py-2 text-sm font-medium text-medium transition-all hover:bg-medium/30"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
