import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { sampleProfiles } from "@/data/sampleProfiles"
import type { TimetablePlan, TimetableProfile, GeneratePlanOptions, SlotStatus } from "@/utils/timetableAlgo"
import { generatePlan, adjustForMissedSessions } from "@/utils/timetableAlgo"

export type ExportFormat = "json" | "pdf"

type GenerationStatus = "idle" | "running" | "success" | "error"

export interface TimetableStoreState {
  profiles: TimetableProfile[]
  activeProfileId: string | null
  currentPlan: TimetablePlan | null
  generationStatus: GenerationStatus
  generationProgress: number
  addProfile: (profile: TimetableProfile) => void
  updateProfile: (id: string, data: Partial<TimetableProfile>) => void
  deleteProfile: (id: string) => void
  setActiveProfile: (id: string) => void
  generatePlan: (profileId: string, options?: GeneratePlanOptions) => Promise<TimetablePlan | null>
  cancelGeneration: () => void
  markSlotDone: (date: string, slotId: string) => void
  moveSlotToDay: (slotId: string, fromDate: string, toDate: string) => void
  adjustAfterMissed: (date: string) => void
}

const memoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

// Safe storage wrapper to avoid JSON parse / quota errors blanking UI
const safeStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null
    try {
      return window.localStorage.getItem(name)
    } catch (err) {
      console.warn("[timetableStore] getItem failed", err)
      return null
    }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(name, value)
    } catch (err) {
      console.warn("[timetableStore] setItem failed", err)
    }
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.removeItem(name)
    } catch (err) {
      console.warn("[timetableStore] removeItem failed", err)
    }
  },
}

const storageFactory = () => (typeof window === "undefined" ? memoryStorage : safeStorage)

const ensureArray = <T>(value: unknown, fallback: T[]): T[] => (Array.isArray(value) ? (value as T[]) : fallback)

let cancelFlag = false

export const useTimetableStore = create<TimetableStoreState>()(
  persist(
    (set, get) => ({
      profiles: sampleProfiles,
      activeProfileId: sampleProfiles[0]?.id ?? null,
      currentPlan: null,
      generationStatus: "idle",
      generationProgress: 0,
      addProfile: (profile) =>
        set((state) => ({
          profiles: [profile, ...state.profiles],
          activeProfileId: profile.id,
        })),
      updateProfile: (id, data) =>
        set((state) => ({
          profiles: state.profiles.map((profile) => (profile.id === id ? { ...profile, ...data } : profile)),
        })),
      deleteProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((profile) => profile.id !== id),
          activeProfileId: state.activeProfileId === id ? state.profiles[0]?.id ?? null : state.activeProfileId,
        })),
      setActiveProfile: (id) => set({ activeProfileId: id }),
      cancelGeneration: () => {
        cancelFlag = true
        set({ generationStatus: "idle", generationProgress: 0 })
      },
      generatePlan: async (profileId, options) => {
        const profile = get().profiles.find((item) => item.id === profileId)
        if (!profile) {
          set({ generationStatus: "error" })
          return null
        }
        cancelFlag = false
        set({ generationStatus: "running", generationProgress: 0 })
        for (let progress = 10; progress <= 90; progress += 20) {
          if (cancelFlag) return null
          set({ generationProgress: progress })
          await new Promise((resolve) => setTimeout(resolve, 80))
        }
        if (cancelFlag) return null
        const plan = generatePlan(profile, options)
        set({ currentPlan: plan, generationStatus: "success", generationProgress: 100 })
        return plan
      },
      markSlotDone: (date, slotId) =>
        set((state) => {
          if (!state.currentPlan) return {}
          const days = state.currentPlan.days.map((day) => {
            if (day.date !== date) return day
            const slots = day.slots.map((slot) =>
              slot.id === slotId
                ? { ...slot, status: (slot.status === "done" ? "pending" : "done") as SlotStatus }
                : slot,
            )
            const completedMinutes = slots
              .filter((slot) => slot.status === "done" && slot.type === "study")
              .reduce((sum, slot) => sum + slot.durationMinutes, 0)
            return { ...day, slots, completedMinutes }
          })
          return { currentPlan: { ...state.currentPlan, days } }
        }),
      moveSlotToDay: (slotId, fromDate, toDate) =>
        set((state) => {
          if (!state.currentPlan) return {}
          const planCopy: TimetablePlan = {
            ...state.currentPlan,
            days: state.currentPlan.days.map((day) => ({ ...day, slots: day.slots.map((slot) => ({ ...slot })) })),
          }
          const fromDay = planCopy.days.find((day) => day.date === fromDate)
          const toDay = planCopy.days.find((day) => day.date === toDate)
          if (!fromDay || !toDay) return {}
          const slotIndex = fromDay.slots.findIndex((slot) => slot.id === slotId)
          if (slotIndex === -1) return {}
          const [slot] = fromDay.slots.splice(slotIndex, 1)
          slot.status = "pending"
          toDay.slots.push(slot)
          fromDay.completedMinutes = fromDay.slots
            .filter((entry) => entry.status === "done" && entry.type === "study")
            .reduce((sum, entry) => sum + entry.durationMinutes, 0)
          toDay.completedMinutes = toDay.slots
            .filter((entry) => entry.status === "done" && entry.type === "study")
            .reduce((sum, entry) => sum + entry.durationMinutes, 0)
          return { currentPlan: planCopy }
        }),
      adjustAfterMissed: (date) => {
        const plan = get().currentPlan
        if (!plan) return
        const adjusted = adjustForMissedSessions(plan, date)
        set({ currentPlan: adjusted })
      },
    }),
    {
      name: "study-timetable-store",
      storage: createJSONStorage(storageFactory),
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        currentPlan: state.currentPlan,
      }),
      merge: (persisted, current) => {
        if (!persisted) return current
        const typed = persisted as Partial<TimetableStoreState>
        return {
          ...current,
          ...typed,
          profiles: ensureArray(typed.profiles, current.profiles),
          activeProfileId: typed.activeProfileId ?? current.activeProfileId,
          currentPlan: typed.currentPlan ?? current.currentPlan,
        }
      },
    }
  )
)

// Fallback example if Zustand is unavailable:
// export const TimetableContext = createContext<TimetableStoreState | null>(null)
// export const useTimetableStoreFallback = () => {
//   const ctx = useContext(TimetableContext)
//   if (!ctx) throw new Error("Timetable store missing")
//   return ctx
// }
