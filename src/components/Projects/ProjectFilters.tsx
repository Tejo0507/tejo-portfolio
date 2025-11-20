import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useProjectStore } from "@/store/projectStore"
import type { ProjectDifficulty } from "@/data/projects"

interface ProjectFiltersProps {
  availableTech: string[]
  minYear: number
  maxYear: number
}

const difficulties: ProjectDifficulty[] = ["Beginner", "Intermediate", "Advanced"]
const DEBOUNCE_MS = 220

export default function ProjectFilters({ availableTech, minYear, maxYear }: ProjectFiltersProps) {
  const filters = useProjectStore((state) => state.filters)
  const setFilters = useProjectStore((state) => state.setFilters)
  const [search, setSearch] = useState(filters.search)

  useEffect(() => {
    const id = window.setTimeout(() => setFilters({ search }), DEBOUNCE_MS)
    return () => window.clearTimeout(id)
  }, [search, setFilters])

  const toggleTech = (tech: string) => {
    const exists = filters.tech.includes(tech)
    const next = exists ? filters.tech.filter((item) => item !== tech) : [...filters.tech, tech]
    setFilters({ tech: next })
  }

  const toggleDifficulty = (level: ProjectDifficulty) => {
    const exists = filters.difficulty.includes(level)
    const next = exists ? filters.difficulty.filter((item) => item !== level) : [...filters.difficulty, level]
    setFilters({ difficulty: next })
  }

  const updateYear = (index: 0 | 1, value: number) => {
    const next: [number, number] = [...filters.yearRange] as [number, number]
    next[index] = value
    if (next[0] > next[1]) {
      next[1] = next[0]
    }
    setFilters({ yearRange: next })
  }

  const clearFilters = () => {
    setFilters({
      tech: [],
      difficulty: difficulties,
      yearRange: [minYear, maxYear],
      search: "",
    })
    setSearch("")
  }

  return (
    <section aria-labelledby="project-filters" className="space-y-5 rounded-2xl border border-medium/15 bg-dark/60 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 id="project-filters" className="text-xl font-semibold text-medium">
          Filters
        </h2>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs uppercase tracking-[0.3em] text-medium/70 hover:text-medium"
        >
          Clear
        </button>
      </div>

      <label className="flex flex-col gap-2 text-sm text-medium/80">
        <span className="text-xs uppercase tracking-[0.3em] text-medium/70">Search</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects"
          className="rounded-xl border border-medium/25 bg-dark/80 px-4 py-2 text-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium/60"
        />
      </label>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-medium/70">Tech</p>
        <div className="mt-2 flex flex-wrap gap-2" role="list">
          {availableTech.map((tech) => {
            const active = filters.tech.includes(tech)
            return (
              <button
                key={tech}
                type="button"
                role="listitem"
                onClick={() => toggleTech(tech)}
                className={[
                  "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] transition-colors duration-smooth ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium/60",
                  active ? "border-medium bg-medium/20 text-medium" : "border-medium/20 text-medium/70 hover:border-medium/40",
                ].join(" ")}
              >
                {tech}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-medium/70">Difficulty</p>
        <div className="mt-2 flex flex-col gap-2">
          {difficulties.map((level) => {
            const active = filters.difficulty.includes(level)
            return (
              <label key={level} className="flex items-center gap-3 text-sm text-medium/80">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleDifficulty(level)}
                  className="accent-medium"
                />
                {level}
              </label>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-medium/70">Year range</p>
        <div className="flex items-center gap-3 text-sm text-medium/70">
          <span>{filters.yearRange[0]}</span>
          <span className="text-medium/30">—</span>
          <span>{filters.yearRange[1]}</span>
        </div>
        <div className="flex flex-col gap-2">
          <motion.input
            type="range"
            min={minYear}
            max={maxYear}
            value={filters.yearRange[0]}
            onChange={(event) => updateYear(0, Number(event.target.value))}
            className="w-full accent-medium"
            whileTap={{ scale: 0.99 }}
          />
          <motion.input
            type="range"
            min={minYear}
            max={maxYear}
            value={filters.yearRange[1]}
            onChange={(event) => updateYear(1, Number(event.target.value))}
            className="w-full accent-medium"
            whileTap={{ scale: 0.99 }}
          />
        </div>
      </div>
    </section>
  )
}
