import { FloatingNavbar, CursorGradient, RotatingTagline } from "@/components"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const taglines = [
  "AI/ML Developer",
  "Always learning. Always improving.",
]

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-dark via-dark/95 to-dark text-medium">
      <FloatingNavbar />
      <CursorGradient />

      <div className="relative z-20 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-12 px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.45, 0.05, 0.25, 0.95] }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-medium/70">Portfolio</p>
          <motion.h1
            className="text-balance text-5xl font-semibold leading-tight text-medium drop-shadow-[0_4px_20px_rgba(46,31,27,0.7)] sm:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.45, 0.05, 0.25, 0.95] }}
          >
            Tejo Sridhar M V S
          </motion.h1>
          <RotatingTagline lines={taglines} />
          <p className="max-w-2xl text-balance text-base text-medium/80">
            I work on projects mostly related to AI and machine learning. I also have experience in web development.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.45, 0.05, 0.25, 0.95] }}
        >
          <Link
            to="/projects"
            className="w-full rounded-2xl border border-medium/40 bg-medium/80 px-8 py-3 text-center text-base font-semibold text-dark shadow-soft transition-colors duration-smooth ease-smooth hover:bg-medium sm:w-auto"
          >
            Explore Work
          </Link>
          <Link
            to="/contact"
            className="w-full rounded-2xl border border-medium/40 bg-transparent px-8 py-3 text-center text-base font-semibold text-medium transition-colors duration-smooth ease-smooth hover:bg-dark/60 sm:w-auto"
          >
            Contact
          </Link>
          <Link
            to="/ai-lab"
            className="w-full rounded-2xl border border-medium/20 bg-dark/30 px-8 py-3 text-center text-base font-semibold text-medium/90 transition-colors duration-smooth ease-smooth hover:bg-dark/60 sm:w-auto"
          >
            Visit AI Lab
          </Link>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(94,75,67,0.25),_transparent_60%)]" aria-hidden />
    </div>
  )
}
