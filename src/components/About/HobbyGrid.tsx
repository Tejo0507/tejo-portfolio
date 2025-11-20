import { motion } from "framer-motion"
import HobbyCard from "./HobbyCard"

const hobbies = [
  {
    title: "Chess",
    description: "Keeps pattern recognition sharp and reminds me to think five moves ahead in product work.",
    icon: "♟️",
  },
  {
    title: "Cricket",
    description: "Weekend matches balance the desk hours and keep teamwork instincts honest.",
    icon: "🏏",
  },
  {
    title: "Python",
    description: "Still my comfort language for rapid tools and playful experiments.",
    icon: "🐍",
  },
  {
    title: "AI",
    description: "Tinkering with small models to make study helpers and music bots feel more human.",
    icon: "🤖",
  },
]

export default function HobbyGrid() {
  return (
    <section aria-labelledby="about-hobbies-title" className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-medium/70">Side quests</p>
        <h2 id="about-hobbies-title" className="text-3xl font-semibold text-medium">
          Hobbies that keep the brain curious
        </h2>
      </div>

      <motion.div
        className="grid gap-5 md:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        {hobbies.map((hobby) => (
          <motion.div
            key={hobby.title}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.45, 0.05, 0.25, 0.95] }}
          >
            <HobbyCard {...hobby} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
