import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Filter, RefreshCcw, Search, Tag, X } from "lucide-react"
import { MaterialsDashboard } from "@/components/Materials/MaterialsDashboard"
import { MaterialCard } from "@/components/Materials/MaterialCard"
import { MaterialViewer } from "@/components/Materials/MaterialViewer"
import { useMaterialsStore } from "@/store/materialsStore"
import type { Material, MaterialFilters } from "@/types/materials"
import type { MaterialFileType } from "@/utils/driveUtils"
import { cn } from "@/utils"

const fileTypeOptions: { value: MaterialFileType; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "video", label: "Video" },
  { value: "google-doc", label: "Doc" },
  { value: "google-slide", label: "Slides" },
  { value: "sheet", label: "Sheets" },
  { value: "ppt", label: "PPT" },
  { value: "doc", label: "Word" },
]

export default function StudyMaterialsPage() {
  const materials = useMaterialsStore((state) => state.materials)
  const filters = useMaterialsStore((state) => state.filters)
  const setFilters = useMaterialsStore((state) => state.setFilters)
  const clearFilters = useMaterialsStore((state) => state.clearFilters)
  const selectedMaterialId = useMaterialsStore((state) => state.selectedMaterialId)
  const setSelectedMaterial = useMaterialsStore((state) => state.setSelectedMaterial)

  const [filtersOpen, setFiltersOpen] = useState(false)

  const subjects = useMemo(() => Array.from(new Set(materials.map((material) => material.subject))).sort(), [materials])
  const semesters = useMemo(() => Array.from(new Set(materials.map((material) => material.semester))).sort(), [materials])
  const tagCloud = useMemo(() => Array.from(new Set(materials.flatMap((material) => material.tags))).sort(), [materials])

  const safeMaterials = useMemo(() => (Array.isArray(materials) ? materials : []), [materials])
  const filteredMaterials = useMemo(() => applyFilters(safeMaterials, filters), [safeMaterials, filters])
  const viewerMaterial = useMemo(
    () => safeMaterials.find((material) => material.id === selectedMaterialId) ?? null,
    [safeMaterials, selectedMaterialId]
  )
  const toggleType = (type: MaterialFileType) => {
    const exists = filters.types.includes(type)
    setFilters({ types: exists ? filters.types.filter((entry) => entry !== type) : [...filters.types, type] })
  }
  const toggleTag = (tag: string) => {
    const exists = filters.tags.includes(tag)
    setFilters({ tags: exists ? filters.tags.filter((entry) => entry !== tag) : [...filters.tags, tag] })
  }

  return (
    <div className="relative min-h-screen bg-[#120906] pb-16 text-[#F7E6D4]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(94,75,67,0.2),_transparent_60%)]" aria-hidden />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 lg:px-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">Study materials hub</p>
          <h1 className="text-3xl font-semibold text-[#F7E6D4]">Organize every semester artifact</h1>
          <p className="max-w-3xl text-sm text-[#F7E6D4]/80">
            Pin canonical notes, Google Drive decks, and lab videos into a single workspace. Filters, bookmarks, viewer, and personal
            notes stay local so you can prep even when offline.
          </p>
        </header>

        <MaterialsDashboard />

        <section className="rounded-[32px] border border-[#5E4B43]/30 bg-[#1B120D]/80 p-6 shadow-[0_30px_120px_rgba(18,9,6,0.6)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/60">Filters</p>
              <p className="text-sm text-[#F7E6D4]/80">Search, slice, and bookmark without touching the originals.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#5E4B43]/50 px-4 py-2 text-sm"
              >
                <Filter className="h-4 w-4" />
                {filtersOpen ? "Hide filters" : "Show filters"}
              </button>
              <button
                type="button"
                onClick={() => clearFilters()}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#5E4B43]/20 px-3 py-2 text-xs text-[#F7E6D4]/70 hover:text-[#F7E6D4]"
              >
                <RefreshCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>

          {filtersOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <label className="flex flex-col gap-2 text-sm text-[#F7E6D4]/80">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">Search</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-[#5E4B43]/40 bg-[#0E0704] px-3 py-2">
                    <Search className="h-4 w-4 text-[#F7E6D4]/60" />
                    <input
                      value={filters.search}
                      onChange={(event) => setFilters({ search: event.target.value })}
                      placeholder="Linear algebra, lab, doc…"
                      className="flex-1 bg-transparent text-sm text-[#F7E6D4] placeholder:text-[#F7E6D4]/30 focus:outline-none"
                    />
                  </div>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectField
                    label="Subject"
                    value={filters.subject ?? ""}
                    onChange={(value) => setFilters({ subject: value || null })}
                    options={subjects}
                  />
                  <SelectField
                    label="Semester"
                    value={filters.semester ?? ""}
                    onChange={(value) => setFilters({ semester: value || null })}
                    options={semesters}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">Types</p>
                  <div className="flex flex-wrap gap-2">
                    {fileTypeOptions.map((option) => {
                      const active = filters.types.includes(option.value)
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleType(option.value)}
                          className={cn(
                            "rounded-full px-4 py-1 text-xs",
                            active
                              ? "border border-[#F7E6D4]/70 bg-[#5E4B43]/70 text-[#120906]"
                              : "border border-[#5E4B43]/40 text-[#F7E6D4]/80 hover:border-[#F7E6D4]/50"
                          )}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">
                  <input
                    type="checkbox"
                    checked={filters.showArchived}
                    onChange={(event) => setFilters({ showArchived: event.target.checked })}
                    className="h-4 w-4 rounded border-[#5E4B43]/60 bg-transparent accent-[#5E4B43]"
                  />
                  Show archived
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">Tags</p>
                <div className="flex flex-wrap gap-2 rounded-3xl border border-dashed border-[#5E4B43]/40 bg-[#0E0704]/60 p-4 text-xs">
                  {tagCloud.length === 0 && <p className="text-[#F7E6D4]/50">Add tags to your materials to filter here.</p>}
                  {tagCloud.map((tag) => {
                    const active = filters.tags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-3 py-1",
                          active ? "border-[#F7E6D4] text-[#120906] bg-[#F7E6D4]" : "border-[#5E4B43]/40 text-[#F7E6D4]/80"
                        )}
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                        {active && <X className="h-3 w-3" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between text-sm text-[#F7E6D4]/70">
            <p>
              Showing <span className="text-[#F7E6D4]">{filteredMaterials.length}</span> of {safeMaterials.length} materials
            </p>
            {filters.search && <p className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/50">Query: {filters.search}</p>}
          </div>
          {filteredMaterials.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} onView={(entry) => setSelectedMaterial(entry.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#5E4B43]/40 bg-[#1E1410]/60 p-8 text-center text-sm text-[#F7E6D4]/70">
              Nothing matches those filters yet. Try clearing a tag or toggling archived items.
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>{viewerMaterial && <MaterialViewer material={viewerMaterial} onClose={() => setSelectedMaterial(null)} />}</AnimatePresence>
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-[#F7E6D4]/80">
      <span className="text-xs uppercase tracking-[0.3em] text-[#F7E6D4]/60">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-[#5E4B43]/40 bg-[#0E0704] px-3 py-2 text-sm text-[#F7E6D4] focus:border-[#F7E6D4] focus:outline-none"
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#0E0704]">
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function applyFilters(materials: Material[], filters: MaterialFilters) {
  const needle = filters.search.trim().toLowerCase()
  return materials.filter((material) => {
    if (!filters.showArchived && material.archived) return false
    if (needle && !`${material.title} ${material.description} ${material.subject}`.toLowerCase().includes(needle)) return false
    if (filters.subject && material.subject !== filters.subject) return false
    if (filters.semester && material.semester !== filters.semester) return false
    if (filters.types.length && !filters.types.includes(material.fileType)) return false
    if (filters.tags.length && !filters.tags.every((tag) => material.tags.includes(tag))) return false
    return true
  })
}
