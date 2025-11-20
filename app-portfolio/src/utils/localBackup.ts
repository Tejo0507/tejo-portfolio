import { timestampNow } from "./generateId"

const STORAGE_KEY = "portfolio-admin-backup"

export function exportState<T>(data: T) {
  const payload = {
    exportedAt: timestampNow(),
    data,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `portfolio-admin-backup-${Date.now()}.json`
  anchor.click()
  URL.revokeObjectURL(url)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function importState<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        resolve(parsed.data as T)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

export function getLastBackup() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as { exportedAt: string }
  } catch (error) {
    console.error("Failed to parse backup", error)
    return null
  }
}
