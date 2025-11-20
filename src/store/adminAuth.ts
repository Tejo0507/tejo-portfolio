import { create } from "zustand"
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware"

interface AdminAuthState {
  isUnlocked: boolean
  password: string
  lastActive: number
  inactivityMs: number
  lockModalOpen: boolean
  attempts: number
  login: (value: string) => boolean
  logout: () => void
  toggleLockModal: (open: boolean) => void
  updatePassword: (next: string) => void
  setInactivityMinutes: (minutes: number) => void
  registerActivity: () => void
  shouldLock: () => boolean
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const storage = createJSONStorage<AdminAuthState>(() => (typeof window !== "undefined" ? localStorage : memoryStorage))

export const  useAdminAuth = create(
  persist<AdminAuthState>(
    (set, get) => ({
      isUnlocked: false,
      password: "artisan-admin",
      lastActive: Date.now(),
      inactivityMs: 1000 * 60 * 5,
      lockModalOpen: false,
      attempts: 0,
      login: (value) => {
        const passMatch = value.trim() === get().password
        set({ attempts: get().attempts + 1 })
        if (passMatch) {
          set({ isUnlocked: true, lastActive: Date.now(), attempts: 0, lockModalOpen: false })
          return true
        }
        return false
      },
      logout: () => set({ isUnlocked: false }),
      toggleLockModal: (open) => set({ lockModalOpen: open }),
      updatePassword: (next) => set({ password: next }),
      setInactivityMinutes: (minutes) => set({ inactivityMs: minutes * 60 * 1000 }),
      registerActivity: () => set({ lastActive: Date.now() }),
      shouldLock: () => Date.now() - get().lastActive > get().inactivityMs,
    }),
    {
      name: "portfolio-admin-auth",
  storage,
  skipHydration: typeof window === "undefined",
    }
  )
)

// React context fallback example:
// const AdminAuthContext = createContext<AdminAuthState | null>(null)
// export function useAdminAuthFallback() {
//   const value = useContext(AdminAuthContext)
//   if (!value) throw new Error("AdminAuthContext missing")
//   return value
// }
