import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { MainLayout } from "@/layouts"

const upcomingFeatures = [
  {
    id: "book",
    title: "Book",
    description: "Interactive flip-book portfolio showcasing projects and experiences in a unique format.",
    status: "Under Development",
  },
  {
    id: "os",
    title: "OS",
    description: "A mini operating system interface with desktop, windows, and app experiences.",
    status: "Under Development",
  },
  {
    id: "ailab",
    title: "AI Lab",
    description: "Interactive AI/ML experimentation platform with live demos, model testing, and cutting-edge AI tools.",
    status: "Under Development",
  },
  {
    id: "about",
    title: "About",
    description: "Detailed information about background, journey, and professional story.",
    status: "Under Development",
  },
  {
    id: "snippets",
    title: "Coding Snippets",
    description: "Collection of reusable code snippets, tips, and programming solutions.",
    status: "Under Development",
  },
  {
    id: "materials",
    title: "Study Materials",
    description: "Curated learning resources, notes, and educational content for various topics.",
    status: "Under Development",
  },
]

export default function UpcomingFeaturesPage() {
  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-dark via-dark/95 to-dark text-medium">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(94,75,67,0.15),_transparent_60%)]" aria-hidden />

        <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-medium/70">Coming Soon</p>
            <h1 className="text-4xl font-semibold leading-tight text-medium">Upcoming Features</h1>
            <p className="max-w-3xl text-base text-medium/80">
              Exciting new sections are currently under development. Check back soon to explore these features.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingFeatures.map((feature, index) => (
              <motion.article
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.45, 0.05, 0.25, 0.95] }}
                className="relative rounded-2xl border border-medium/15 bg-dark/50 p-6 shadow-soft"
              >
                <div className="absolute right-4 top-4 rounded-full bg-medium/10 p-2">
                  <Lock className="h-4 w-4 text-medium/60" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-medium">{feature.title}</h2>
                  <p className="text-sm text-medium/80">{feature.description}</p>
                  
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-medium/25 bg-dark/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-medium/70">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-medium/50" />
                    {feature.status}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-medium/15 bg-dark/60 p-6 text-center">
            <p className="text-sm text-medium/80">
              These features are being actively developed. Stay tuned for updates!
            </p>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}
