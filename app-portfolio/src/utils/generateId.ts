export function generateId(prefix = "item") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function timestampNow() {
  return new Date().toISOString()
}
