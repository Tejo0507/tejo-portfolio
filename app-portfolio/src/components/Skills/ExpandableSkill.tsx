import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { SkillMeta } from "@/data/skills"
import { useSkillStore } from "@/store/skillStore"

interface ExpandableSkillProps {
  skill: SkillMeta
}

export default function ExpandableSkill({ skill }: ExpandableSkillProps) {
  const shouldReduceMotion = useReducedMotion()
  const expandedSkillIds = useSkillStore((state) => state.expandedSkillIds)
  const toggleSkillExpand = useSkillStore((state) => state.toggleSkillExpand)
  const isExpanded = expandedSkillIds[skill.id] ?? false

  const snippet = `// ${skill.name} in practice\n// ${skill.description}`

  return (
    <motion.article
      layout
      className="rounded-2xl border border-medium/15 bg-dark/50 p-5 shadow-soft"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.45, 0.05, 0.25, 0.95] }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-medium">{skill.name}</h3>
            <p className="text-sm text-medium/80">{skill.description}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleSkillExpand(skill.id)}
            className="self-start rounded-xl border border-medium/30 px-3 py-2 text-sm font-medium text-medium transition-colors duration-smooth ease-smooth hover:bg-dark/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium/60"
            aria-expanded={isExpanded}
            aria-controls={`skill-details-${skill.id}`}
          >
            {isExpanded ? "Hide details" : "See details"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2" role="list">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              role="listitem"
              className="rounded-full border border-medium/25 px-3 py-1 text-xs uppercase tracking-[0.3em] text-medium/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`skill-details-${skill.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.45, 0.05, 0.25, 0.95] }}
            className="mt-5 space-y-4 overflow-hidden"
          >
            <p className="text-sm text-medium/80">{skill.notes}</p>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-medium/70">Tiny snippet</p>
              <pre className="mt-2 rounded-2xl border border-medium/20 bg-[#241712] p-4 text-xs text-medium/90 shadow-inner">
                <code>{snippet}</code>
              </pre>
            </div>
            {skill.links && skill.links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {skill.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-medium/30 px-3 py-2 text-sm text-medium transition-colors duration-smooth ease-smooth hover:bg-dark/60"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
