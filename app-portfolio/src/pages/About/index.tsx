import { MainLayout } from "@/layouts"
import Timeline from "@/components/About/Timeline"
import HobbyGrid from "@/components/About/HobbyGrid"
import ValuesGrid from "@/components/About/ValuesGrid"
import EasterEgg from "@/components/About/EasterEgg"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-dark via-dark/95 to-dark text-medium">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(94,75,67,0.15),_transparent_55%)]" aria-hidden />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-16 px-6 py-20">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.45, 0.05, 0.25, 0.95] }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-medium/70">About</p>
                <h1 className="text-4xl font-semibold leading-tight text-medium">
                  Systems thinker with a warm desk setup mindset
                </h1>
              </div>
              <EasterEgg />
            </div>
            <p className="max-w-3xl text-base text-medium/80">
              I do coding and I learn new tech. In my free time, I watch cartoons, read articles, and play cricket. Along with these hobbies, I work on AI, machine learning, and web development projects.
            </p>
          </motion.header>

          <Timeline />
          <HobbyGrid />
          <ValuesGrid />
        </div>
      </div>
    </MainLayout>
  )
}
