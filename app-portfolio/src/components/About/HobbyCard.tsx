import { motion } from "framer-motion"

export interface HobbyCardProps {
  title: string
  description: string
  icon: string
}

export default function HobbyCard({ title, description, icon }: HobbyCardProps) {
  return (
    <motion.article
      tabIndex={0}
      role="group"
      aria-label={`${title} hobby`}
      className="flex h-full flex-col gap-3 rounded-2xl border border-medium/15 bg-dark/60 p-5 text-left text-medium shadow-soft outline-none transition-colors duration-smooth ease-smooth focus-visible:border-medium/60"
      whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
      whileFocus={{ y: -6, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-medium/25 bg-dark text-2xl">
        {icon}
      </span>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-medium/80">{description}</p>
      </div>
    </motion.article>
  )
}
