import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useSkillStore } from "@/store/skillStore"

interface SkillFiltersProps {
  availableTags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  difficulty: number
  onDifficultyChange: (value: number) => void
}

const DEBOUNCE_MS = 220

export default function SkillFilters({ availableTags, selectedTags, onTagToggle, difficulty, onDifficultyChange }: SkillFiltersProps) {
  const setSearch = useSkillStore((state) => state.setSearch)
  const storeQuery = useSkillStore((state) => state.searchQuery)
  const [query, setQuery] = useState(storeQuery)

  useEffect(() => {
    const id = window.setTimeout(() => setSearch(query), DEBOUNCE_MS)
    return () => window.clearTimeout(id)
  }, [query, setSearch])

  const sortedTags = useMemo(() => [...availableTags].sort(), [availableTags])

  return (
    <section aria-labelledby="skills-filters" className="space-y-5 rounded-2xl border border-medium/15 bg-dark/60 p-5 shadow-soft">
      <h2 id="skills-filters" className="text-xl font-semibold text-medium">
        Filters
      </h2>
      <label className="flex flex-col gap-2 text-sm text-medium/80">
        <span className="text-xs uppercase tracking-[0.3em] text-medium/70">Search</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a skill"
          className="rounded-xl border border-medium/25 bg-dark/80 px-4 py-2 text-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium/60"
        />
      </label>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-medium/70">Tags</p>
        <div className="mt-2 flex flex-wrap gap-2" role="list">
          {sortedTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                role="listitem"
                onClick={() => onTagToggle(tag)}
                className={[
                  "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] transition-colors duration-smooth ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium/50",
                  isSelected ? "border-medium bg-medium/20 text-medium" : "border-medium/25 text-medium/70 hover:border-medium/50",
                ].join(" ")}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-medium/70" htmlFor="difficulty-range">
          Minimum confidence: {difficulty}%
        </label>
        <motion.input
          id="difficulty-range"
          type="range"
          min={0}
          max={100}
          value={difficulty}
          onChange={(event) => onDifficultyChange(Number(event.target.value))}
          className="w-full accent-medium"
          whileTap={{ scale: 0.99 }}
        />
      </div>
    </section>
  )
}
