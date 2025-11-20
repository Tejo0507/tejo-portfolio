import { motion } from "framer-motion"
import type { SkillCategory } from "@/data/skills"

interface SkillCategoryCardProps {
  category: SkillCategory
  count: number
  isActive: boolean
  onSelect: (id: string | null) => void
}

export default function SkillCategoryCard({ category, count, isActive, onSelect }: SkillCategoryCardProps) {
  return (
    <motion.button
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect(isActive ? null : category.id)}
      className={[
        "w-full rounded-2xl border px-4 py-3 text-left transition-all duration-smooth ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium/60",
        isActive ? "border-medium bg-medium/20 text-medium" : "border-medium/15 bg-dark/50 text-medium/80 hover:border-medium/40",
      ].join(" ")}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-medium/70">{category.name}</p>
            <p className="text-lg font-semibold text-medium">{count} skills</p>
          </div>
        </div>
        <span className="text-xs text-medium/60">{isActive ? "Viewing" : "View"}</span>
      </div>
    </motion.button>
  )
}
