import { motion } from "framer-motion"

interface ValueTile {
  title: string
  body: string
  badge: string
}

const values: ValueTile[] = [
  { title: "Focus", body: "Protect long stretches of deep work to keep ideas coherent.", badge: "01" },
  { title: "Build", body: "Ship tactile tools that solve real pain, not imaginary personas.", badge: "02" },
  { title: "Iterate", body: "Feedback loops stay open, even when the feature feels done.", badge: "03" },
  { title: "Learn", body: "Stay a student—new models, new craft, new questions.", badge: "04" },
]

export default function ValuesGrid() {
  return (
    <section aria-labelledby="about-values-title" className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-medium/70">Core values</p>
        <h2 id="about-values-title" className="text-3xl font-semibold text-medium">
          Principles that steer the work
        </h2>
      </div>

      <motion.div
        className="grid gap-5 md:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {values.map((value) => (
          <motion.article
            key={value.title}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.55, ease: [0.45, 0.05, 0.25, 0.95] }}
            className="rounded-2xl border border-medium/15 bg-dark/50 p-6 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-medium/30 text-sm font-semibold text-medium/80">
                {value.badge}
              </span>
              <h3 className="text-xl font-semibold text-medium">{value.title}</h3>
            </div>
            <p className="mt-3 text-medium/80">{value.body}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
