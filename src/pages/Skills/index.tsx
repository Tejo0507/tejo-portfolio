import { useMemo } from "react"
import { MainLayout } from "@/layouts"
import { skillCategories, skills } from "@/data/skills"
import { ExpandableSkill, SkillCategoryCard } from "@/components"
import { useSkillStore } from "@/store/skillStore"
import { motion } from "framer-motion"

export default function SkillsPage() {
  const categoryFilter = useSkillStore((state) => state.categoryFilter)
  const setCategoryFilter = useSkillStore((state) => state.setCategoryFilter)
  const searchQuery = useSkillStore((state) => state.searchQuery)



  const categoryCounts = useMemo(
    () =>
      skillCategories.map((category) => ({
        category,
        count: skills.filter((skill) => skill.categoryId === category.id).length,
      })),
    [],
  )

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      if (categoryFilter && skill.categoryId !== categoryFilter) return false
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase()
        const composite = `${skill.name} ${skill.description} ${skill.tags.join(" ")}`.toLowerCase()
        if (!composite.includes(query)) return false
      }
      return true
    })
  }, [categoryFilter, searchQuery])

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-dark via-dark/95 to-dark text-medium">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(94,75,67,0.15),_transparent_60%)]" aria-hidden />

        <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-medium/70">Skills Dashboard</p>
            <h1 className="text-4xl font-semibold leading-tight text-medium">My Skills</h1>
            <p className="max-w-3xl text-base text-medium/80">
              A living rundown of the tools and systems I rely on every day.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside aria-label="Skill categories" className="space-y-3">
              <motion.nav
                role="list"
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.45, 0.05, 0.25, 0.95] }}
              >
                {categoryCounts.map(({ category, count }) => (
                  <div role="listitem" key={category.id}>
                    <SkillCategoryCard
                      category={category}
                      count={count}
                      isActive={categoryFilter === category.id}
                      onSelect={setCategoryFilter}
                    />
                  </div>
                ))}
              </motion.nav>
            </aside>

            <section aria-label="Skills list" className="space-y-4">
              {filteredSkills.length === 0 ? (
                <p className="rounded-2xl border border-medium/20 bg-dark/60 p-6 text-medium/70">
                  No skills match the current filters.
                </p>
              ) : (
                filteredSkills.map((skill) => <ExpandableSkill key={skill.id} skill={skill} />)
              )}
            </section>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}
