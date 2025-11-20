import { create } from "zustand"
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware"
import type { SkillItem, SkillTimelinePoint, SkillLevel } from "@/data/sampleSkills"
import { sampleSkills } from "@/data/sampleSkills"
import { addActivity } from "@/utils/activityLog"
import { generateId, timestampNow } from "@/utils/generateId"

interface SkillStoreState {
  categoryFilter: string | null
  searchQuery: string
  expandedSkillIds: Record<string, boolean>
  completedLearningIds: Record<string, boolean>
  setCategoryFilter: (id: string | null) => void
  setSearch: (query: string) => void
  toggleSkillExpand: (id: string) => void
  markLearningDone: (id: string) => void
}

export const useSkillStore = create<SkillStoreState>((set) => ({
  categoryFilter: null,
  searchQuery: "",
  expandedSkillIds: {},
  completedLearningIds: {},
  setCategoryFilter: (id) => set({ categoryFilter: id }),
  setSearch: (query) => set({ searchQuery: query }),
  toggleSkillExpand: (id) =>
    set((state) => ({
      expandedSkillIds: { ...state.expandedSkillIds, [id]: !state.expandedSkillIds[id] },
    })),
  markLearningDone: (id) =>
    set((state) => ({
      completedLearningIds: { ...state.completedLearningIds, [id]: true },
    })),
}))

// --- Admin Skill Store -----------------------------------------------------

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const skillStorage = createJSONStorage<AdminSkillStoreState>(() => (typeof window !== "undefined" ? localStorage : memoryStorage))

interface AdminSkillStoreState {
  skills: SkillItem[]
  selectedId: string | null
  drawerOpen: boolean
  createSkill: (data?: Partial<SkillItem>) => void
  updateSkill: (id: string, data: Partial<SkillItem>) => void
  deleteSkill: (id: string) => void
  addTimelineEvent: (id: string, event: Omit<SkillTimelinePoint, "id">) => void
  removeTimelineEvent: (skillId: string, eventId: string) => void
  setSelected: (id: string | null) => void
  toggleDrawer: (open: boolean) => void
  importSkills: (data: SkillItem[]) => void
  setLevel: (id: string, level: SkillLevel) => void
  setProgress: (id: string, value: number) => void
}

export const useAdminSkillStore = create(
  persist<AdminSkillStoreState>(
    (set) => ({
      skills: sampleSkills,
      selectedId: null,
      drawerOpen: false,
      createSkill: (data) =>
        set((state) => {
          const skill: SkillItem = {
            id: data?.id ?? generateId("skill"),
            name: data?.name ?? "New skill",
            level: data?.level ?? "beginner",
            progress: data?.progress ?? 10,
            category: data?.category ?? "General",
            latestUpdate: timestampNow(),
            timeline: data?.timeline ?? [],
            recommended: data?.recommended ?? [],
          }
          addActivity(skill.name, "Added skill", "skill")
          return { skills: [skill, ...state.skills], selectedId: skill.id, drawerOpen: true }
        }),
      updateSkill: (id, data) =>
        set((state) => {
          const target = state.skills.find((skill) => skill.id === id)
          if (!target) return state
          addActivity(target.name, "Updated skill", "skill")
          return {
            skills: state.skills.map((skill) =>
              skill.id === id ? { ...skill, ...data, latestUpdate: timestampNow() } : skill
            ),
          }
        }),
      deleteSkill: (id) =>
        set((state) => {
          const target = state.skills.find((skill) => skill.id === id)
          if (!target) return state
          addActivity(target.name, "Removed skill", "skill")
          return {
            skills: state.skills.filter((skill) => skill.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId,
          }
        }),
      addTimelineEvent: (id, event) =>
        set((state) => {
          const target = state.skills.find((skill) => skill.id === id)
          if (!target) return state
          addActivity(target.name, "Added timeline event", "skill")
          return {
            skills: state.skills.map((skill) =>
              skill.id === id
                ? {
                    ...skill,
                    timeline: [{ id: generateId("sk-event"), ...event }, ...skill.timeline],
                    latestUpdate: timestampNow(),
                  }
                : skill
            ),
          }
        }),
      removeTimelineEvent: (skillId, eventId) =>
        set((state) => {
          const target = state.skills.find((skill) => skill.id === skillId)
          if (!target) return state
          addActivity(target.name, "Removed timeline note", "skill")
          return {
            skills: state.skills.map((skill) =>
              skill.id === skillId
                ? { ...skill, timeline: skill.timeline.filter((item) => item.id !== eventId) }
                : skill
            ),
          }
        }),
      setSelected: (id) => set({ selectedId: id }),
      toggleDrawer: (open) => set({ drawerOpen: open }),
      importSkills: (data) => set({ skills: data }),
      setLevel: (id, level) =>
        set((state) => {
          const target = state.skills.find((skill) => skill.id === id)
          if (!target) return state
          addActivity(target.name, `Set level to ${level}`, "skill")
          return {
            skills: state.skills.map((skill) => (skill.id === id ? { ...skill, level } : skill)),
          }
        }),
      setProgress: (id, value) =>
        set((state) => {
          const target = state.skills.find((skill) => skill.id === id)
          if (!target) return state
          addActivity(target.name, `Progress ${value}%`, "skill")
          return {
            skills: state.skills.map((skill) => (skill.id === id ? { ...skill, progress: value } : skill)),
          }
        }),
    }),
    {
      name: "portfolio-admin-skills",
      storage: skillStorage,
      skipHydration: typeof window === "undefined",
    }
  )
)

// Context fallback example shown for portfolio and admin stores when Zustand is unavailable.
