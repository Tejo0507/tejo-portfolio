export type ActivityType = "project" | "learning" | "ai" | "achievement"

export interface ActivityItem {
  id: string
  title: string
  type: ActivityType
  summary: string
  timestamp: string
  tags: string[]
  details: string
}

export const sampleActivities: ActivityItem[] = [
  {
    id: "act-001",
    title: "Deployed immersive OS workspace",
    type: "project",
    summary: "New windowed mini OS landed with drag-ready widgets.",
    timestamp: "2025-11-10T09:00:00Z",
    tags: ["release", "ui"],
    details: "Rolled out the full mini OS experience with snap-grid behavior, persistence, and keyboard shortcuts for each widget.",
  },
  {
    id: "act-002",
    title: "AI Lab matrix playground",
    type: "ai",
    summary: "Added PCA visualizer diagnostics and dataset presets.",
    timestamp: "2025-11-08T14:30:00Z",
    tags: ["ai", "math"],
    details: "Users can now drop matrices, see eigenvectors, and export progress snapshots for study groups.",
  },
  {
    id: "act-003",
    title: "Skill sprint: Rust network stack",
    type: "learning",
    summary: "Completed async networking exercises as part of daily kata.",
    timestamp: "2025-11-05T19:15:00Z",
    tags: ["skills", "rust"],
    details: "Built a minimal TCP echo server with tokio, instrumented with structured logging and perf hooks.",
  },
  {
    id: "act-004",
    title: "Snippets Vault housekeeping",
    type: "project",
    summary: "Tagged 14 snippets and added inline runner instrumentation.",
    timestamp: "2025-11-02T11:45:00Z",
    tags: ["snippets", "dx"],
    details: "Clipboard reliability is now 99% thanks to async fallbacks and copy notifications.",
  },
  {
    id: "act-005",
    title: "AI assistant benchmark",
    type: "ai",
    summary: "Measured inference latency on local GPU with new tokenization trick.",
    timestamp: "2025-10-29T08:20:00Z",
    tags: ["ai", "benchmark"],
    details: "Cached prompts shaved ~180ms per response, making the voice loop feel instant.",
  },
  {
    id: "act-006",
    title: "Micro-achievement: 30-day streak",
    type: "achievement",
    summary: "Logged learning journal entries for an entire month.",
    timestamp: "2025-10-25T07:05:00Z",
    tags: ["habit"],
    details: "Short reflections on experiments now auto-sync into the knowledge base.",
  },
]
