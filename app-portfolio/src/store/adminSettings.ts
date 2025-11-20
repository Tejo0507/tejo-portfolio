import { create } from "zustand"
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware"
import { addActivity, clearActivityLog } from "@/utils/activityLog"
import { timestampNow } from "@/utils/generateId"

export type AdminTheme = "light" | "brown" | "dark"

interface AdminSettingsState {
  theme: AdminTheme
  accent: string
  widgetToggles: Record<string, boolean>
  quickActions: string[]
  notificationsEnabled: boolean
  lastExportedAt?: string
  setTheme: (theme: AdminTheme) => void
  setAccent: (accent: string) => void
  toggleWidget: (id: string) => void
  setQuickActions: (actions: string[]) => void
  toggleNotifications: () => void
  recordExport: () => void
  resetDashboardWidgets: () => void
  resetAllData: () => void
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const settingsStorage = createJSONStorage<AdminSettingsState>(() => (typeof window !== "undefined" ? localStorage : memoryStorage))

const defaultWidgets = {
  stats: true,
  activity: true,
  quickActions: true,
  timeline: true,
  system: true,
}

const ADMIN_STORAGE_KEYS = [
  "portfolio-admin-projects",
  "portfolio-admin-skills",
  "portfolio-admin-ai-tools",
  "portfolio-admin-snippets",
  "portfolio-admin-messages",
  "portfolio-admin-settings",
  "portfolio-admin-auth",
  "portfolio-admin-activity",
]

export const useAdminSettings = create(
  persist<AdminSettingsState>(
    (set) => ({
      theme: "brown",
      accent: "#F2E4DC",
      widgetToggles: { ...defaultWidgets },
      quickActions: ["Add project", "Record skill", "Open AI lab"],
      notificationsEnabled: true,
      lastExportedAt: undefined,
      setTheme: (theme) => {
        set({ theme })
        addActivity("Theme", `Switched to ${theme}`, "settings")
        if (typeof document !== "undefined") {
          document.documentElement.dataset.adminTheme = theme
        }
      },
      setAccent: (accent) => {
        set({ accent })
        addActivity("Accent", "Updated accent color", "settings")
        if (typeof document !== "undefined") {
          document.documentElement.style.setProperty("--admin-accent", accent)
        }
      },
      toggleWidget: (id) =>
        set((state) => ({
          widgetToggles: { ...state.widgetToggles, [id]: !state.widgetToggles[id] },
        })),
      setQuickActions: (actions) => {
        set({ quickActions: actions })
        addActivity("Quick actions", "Updated shortcuts", "settings")
      },
      toggleNotifications: () =>
        set((state) => {
          addActivity("Notifications", state.notificationsEnabled ? "Disabled alerts" : "Enabled alerts", "settings")
          return { notificationsEnabled: !state.notificationsEnabled }
        }),
      recordExport: () => {
        set({ lastExportedAt: timestampNow() })
        addActivity("Backup", "Exported admin state", "settings")
      },
  resetDashboardWidgets: () => set({ widgetToggles: { ...defaultWidgets } }),
      resetAllData: () => {
        ADMIN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
        clearActivityLog()
        set({
          theme: "brown",
          accent: "#F2E4DC",
          widgetToggles: { ...defaultWidgets },
          quickActions: ["Add project", "Record skill", "Open AI lab"],
          notificationsEnabled: true,
          lastExportedAt: undefined,
        })
        addActivity("Admin", "Reset data", "settings")
      },
    }),
    {
      name: "portfolio-admin-settings",
      storage: settingsStorage,
      skipHydration: typeof window === "undefined",
    }
  )
)

// React context fallback comment left intentionally for future providers.
