import { create } from "zustand"
import {
  dashboardShortcuts,
  dashboardStats,
  projectCategoryData,
  skillMaturityData,
  weeklyActivity,
  type DashboardStats,
  type ProjectCategoryDatum,
  type ShortcutLink,
  type SkillMaturityDatum,
  type WeeklyActivityPoint,
} from "@/data/sampleDashboardStats"
import { sampleActivities, type ActivityItem } from "@/data/sampleActivities"
import { sampleSkills, type SkillItem } from "@/data/sampleSkills"

export interface SystemLoadState {
  cpu: number
  ram: number
  net: number
}

export interface DashboardStoreState {
  stats: DashboardStats
  activity: ActivityItem[]
  skills: SkillItem[]
  system: SystemLoadState
  weeklyActivity: WeeklyActivityPoint[]
  projectCategories: ProjectCategoryDatum[]
  skillMaturity: SkillMaturityDatum[]
  shortcuts: ShortcutLink[]
  actions: {
    addActivity: (item: ActivityItem) => void
    updateStats: (partial: Partial<DashboardStats>) => void
    setSkillLevel: (skillId: string, updates: Partial<SkillItem>) => void
    setSystemLoad: (load: Partial<SystemLoadState>) => void
  }
}

const initialSystemLoad: SystemLoadState = { cpu: 32, ram: 48, net: 62 }

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  stats: dashboardStats,
  activity: sampleActivities,
  skills: sampleSkills,
  system: initialSystemLoad,
  weeklyActivity,
  projectCategories: projectCategoryData,
  skillMaturity: skillMaturityData,
  shortcuts: dashboardShortcuts,
  actions: {
    addActivity: (item) =>
      set((state) => ({
        activity: [{ ...item }, ...state.activity].slice(0, 20),
      })),
    updateStats: (partial) =>
      set((state) => ({
        stats: { ...state.stats, ...partial },
      })),
    setSkillLevel: (skillId, updates) =>
      set((state) => ({
        skills: state.skills.map((skill) => (skill.id === skillId ? { ...skill, ...updates } : skill)),
      })),
    setSystemLoad: (load) =>
      set((state) => ({
        system: { ...state.system, ...load },
      })),
  },
}))

export type { ActivityItem, SkillItem, ShortcutLink }

/*
// Lightweight React Context fallback (if Zustand is unavailable)
// const DashboardStoreContext = createContext<DashboardStoreState | null>(null)
// export function useDashboardStoreFallback() {
//   const ctx = useContext(DashboardStoreContext)
//   if (!ctx) throw new Error("Dashboard store missing provider")
//   return ctx
// }
*/
