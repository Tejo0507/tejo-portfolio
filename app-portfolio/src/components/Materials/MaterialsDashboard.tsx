import { motion } from "framer-motion"
import { BookOpenCheck, FolderKanban, GraduationCap, Layers3 } from "lucide-react"
import { useMemo } from "react"
import { useMaterialsStore } from "@/store/materialsStore"
import type { Material } from "@/types/materials"
import { cn } from "@/utils"

const cardPalette = [
  "from-[#2E1F1B] to-[#5E4B43]",
  "from-[#5E4B43] to-[#2E1F1B]",
  "from-[#3B251F] to-[#5E4B43]",
]

export function MaterialsDashboard() {
  const materials = useMaterialsStore((state) => state.materials)
  const semesterCollections = useMaterialsStore((state) => state.semesterCollections)
  const setSelectedMaterial = useMaterialsStore((state) => state.setSelectedMaterial)

  const stats = useMemo(() => buildStats(materials), [materials])
  const recentMaterials = useMemo(() => materials.slice(0, 3), [materials])

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.article
            key={stat.label}
            className={cn(
              "rounded-2xl border border-[#5E4B43]/40 bg-gradient-to-br p-4 text-[#F7E6D4] shadow-lg shadow-[#2E1F1B]/40",
              cardPalette[index % cardPalette.length]
            )}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/70">{stat.label}</p>
              {stat.icon}
            </div>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
            <p className="text-sm text-[#F7E6D4]/80">{stat.caption}</p>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-[#5E4B43]/40 bg-[#2E1F1B]/70 p-5 text-[#F7E6D4] shadow-xl shadow-[#2E1F1B]/40">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">Recently added</p>
              <h3 className="text-lg font-semibold">Fresh uploads</h3>
            </div>
            <Layers3 className="h-5 w-5" />
          </header>
          <ul className="mt-4 space-y-3">
            {recentMaterials.map((material) => (
              <li key={material.id}>
                <button
                  type="button"
                  onClick={() => setSelectedMaterial(material.id)}
                  className="group flex w-full items-center justify-between rounded-2xl border border-transparent px-3 py-2 text-left transition hover:border-[#5E4B43]/60 hover:bg-[#5E4B43]/20"
                >
                  <div>
                    <p className="text-sm font-semibold">{material.title}</p>
                    <p className="text-xs text-[#F7E6D4]/70">
                      {material.subject} · {new Date(material.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#5E4B43]/50 px-3 py-1 text-xs text-[#F7E6D4]">{material.semester}</span>
                </button>
              </li>
            ))}
            {!recentMaterials.length && <p className="text-sm text-[#F7E6D4]/70">Add materials to see them here.</p>}
          </ul>
        </article>

        <article className="rounded-3xl border border-[#5E4B43]/40 bg-[#2E1F1B]/70 p-5 text-[#F7E6D4] shadow-xl shadow-[#2E1F1B]/40">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">Collections</p>
              <h3 className="text-lg font-semibold">Semester folders</h3>
            </div>
            <FolderKanban className="h-5 w-5" />
          </header>
          <div className="mt-4 grid gap-3">
            {semesterCollections.map((collection) => (
              <div
                key={collection.id}
                className="rounded-2xl border border-[#5E4B43]/50 bg-[#2E1F1B]/60 p-3 text-sm text-[#F7E6D4]/90"
              >
                <p className="font-semibold text-[#F7E6D4]">{collection.title}</p>
                <p className="text-xs text-[#F7E6D4]/70">{collection.semester}</p>
                {collection.description && <p className="mt-1 text-xs text-[#F7E6D4]/70">{collection.description}</p>}
              </div>
            ))}
            {!semesterCollections.length && <p className="text-sm text-[#F7E6D4]/70">Create your first semester collection.</p>}
          </div>
        </article>
      </div>
    </section>
  )
}

function buildStats(materials: Material[]) {
  const total = materials.length
  const bySemester = new Set(materials.map((material) => material.semester)).size
  const archived = materials.filter((material) => material.archived).length
  const recent = materials.filter((material) => Date.now() - Date.parse(material.createdAt) < 1000 * 60 * 60 * 24 * 7).length

  return [
    { label: "Materials", value: total, caption: "Total curated", icon: <BookOpenCheck className="h-5 w-5" /> },
    { label: "Semesters", value: bySemester, caption: "Active terms", icon: <GraduationCap className="h-5 w-5" /> },
    { label: "Archived", value: archived, caption: "Hidden but accessible", icon: <Layers3 className="h-5 w-5" /> },
    { label: "This week", value: recent, caption: "Fresh uploads", icon: <FolderKanban className="h-5 w-5" /> },
  ]
}
