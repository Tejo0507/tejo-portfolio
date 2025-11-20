import { timestampNow } from "./generateId"

export type ActivityKind =
  | "project"
  | "skill"
  | "snippet"
  | "ai-tool"
  | "message"
  | "auth"
  | "settings"

export interface ActivityItem {
  id: string
  label: string
  description: string
  kind: ActivityKind
  createdAt: string
}

const STORAGE_KEY = "portfolio-admin-activity"

export function addActivity(label: string, description: string, kind: ActivityKind) {
  const entry: ActivityItem = {
    id: crypto.randomUUID?.() ?? `activity-${Date.now()}`,
    label,
    description,
    kind,
    createdAt: timestampNow(),
  }

  const current = getActivityLog()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...current].slice(0, 100)))
  return entry
}

export function getActivityLog(): ActivityItem[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as ActivityItem[]
  } catch (error) {
    console.error("Failed to parse activity log", error)
    return []
  }
}

export function clearActivityLog() {
  localStorage.removeItem(STORAGE_KEY)
}
