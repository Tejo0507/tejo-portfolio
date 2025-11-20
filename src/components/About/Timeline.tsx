import { timelineEntries } from "@/data/timeline"
import { motion } from "framer-motion"

export default function Timeline() {
  return (
    <section aria-labelledby="about-timeline-title" className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-medium/70">Journey</p>
        <h2 id="about-timeline-title" className="text-3xl font-semibold text-medium">
          Every chapter sharpened the craft
        </h2>
      </div>

      <ol className="relative border-l border-medium/20 pl-8">
        {timelineEntries.map((entry, index) => (
          <motion.li
            key={`${entry.year}-${entry.title}`}
            className="mb-10 ml-4"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: [0.45, 0.05, 0.25, 0.95] }}
          >
            <span className="absolute -left-6 flex h-10 w-10 items-center justify-center rounded-2xl border border-medium/30 bg-dark text-lg shadow-soft">
              {entry.icon ?? "•"}
            </span>
            <div className="rounded-2xl border border-medium/15 bg-dark/40 p-5 shadow-soft backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-medium/70">{entry.year}</p>
              <h3 className="mt-2 text-xl font-semibold text-medium">{entry.title}</h3>
              <p className="mt-1 text-medium/80">{entry.description}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
