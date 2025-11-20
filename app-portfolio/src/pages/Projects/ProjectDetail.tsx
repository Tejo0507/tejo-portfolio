import { MainLayout } from "@/layouts"
import { projects } from "@/data"
import { motion } from "framer-motion"
import { Link, useParams, Navigate } from "react-router-dom"
import { Github, ExternalLink, ArrowLeft, Calendar, Sparkles } from "lucide-react"

const difficultyColors = {
  Beginner: "bg-green-400/20 text-green-400",
  Intermediate: "bg-yellow-400/20 text-yellow-400",
  Advanced: "bg-red-400/20 text-red-400",
}

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-dark via-dark/95 to-dark text-medium">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(94,75,67,0.15),_transparent_55%)]" aria-hidden />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm text-medium/70 transition-colors hover:text-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </motion.div>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold leading-tight text-medium">
                  {project.title}
                </h1>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyColors[project.difficulty]}`}>
                  {project.difficulty}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-medium/60">
                <Calendar className="h-4 w-4" />
                <span>{project.year}</span>
              </div>

              <p className="text-xl text-medium/80 leading-relaxed">
                {project.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-medium/20 bg-dark/40 px-5 py-2.5 text-sm font-medium text-medium transition-all hover:border-medium/40 hover:bg-dark/60"
                >
                  <Github className="h-4 w-4" />
                  View Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-medium/20 bg-medium/10 px-5 py-2.5 text-sm font-medium text-medium transition-all hover:bg-medium/20"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
            </div>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="rounded-2xl border border-medium/10 bg-dark/40 p-8">
              <h2 className="mb-4 text-2xl font-semibold text-medium">About the Project</h2>
              <p className="text-base text-medium/80 leading-relaxed">
                {project.details.description}
              </p>
            </div>

            <div className="rounded-2xl border border-medium/10 bg-dark/40 p-8">
              <h2 className="mb-4 text-2xl font-semibold text-medium">Architecture</h2>
              <p className="text-base text-medium/80 leading-relaxed">
                {project.details.architecture}
              </p>
            </div>

            <div className="rounded-2xl border border-medium/10 bg-dark/40 p-8">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-medium">
                <Sparkles className="h-5 w-5" />
                Key Highlights
              </h2>
              <ul className="flex flex-col gap-3">
                {project.details.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-base text-medium/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-medium/60" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-medium/10 bg-dark/40 p-8">
              <h2 className="mb-4 text-2xl font-semibold text-medium">Tech Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-medium/20 bg-medium/5 px-4 py-2 text-sm font-medium text-medium/90"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center pt-8"
          >
            <Link
              to="/projects"
              className="rounded-lg border border-medium/20 bg-dark/40 px-6 py-3 text-sm font-medium text-medium transition-all hover:border-medium/40 hover:bg-dark/60"
            >
              View All Projects
            </Link>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
