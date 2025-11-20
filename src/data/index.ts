export type FeatureHighlight = {
  title: string
  description: string
  statusLabel?: string
}

export const featureHighlights: FeatureHighlight[] = [
  {
    title: "Code Snippets Vault",
    description: "Curated snippets with instant copy, live previews, and semantic filters for the exact stack I'm using.",
    statusLabel: "Designing",
  },
  {
    title: "Mini OS Experience",
    description: "Widget-sized micro apps that float like windows, blurring the line between a desk setup and a browser tab.",
    statusLabel: "Research",
  },
  {
    title: "Study Materials Hub",
    description: "Structured reading lists with direct Google Drive handoffs plus quick metadata for context before you dive in.",
  },
  {
    title: "Study Timetable Generator",
    description: "A tactile scheduler that converts subjects and availability into editable blocks you can actually stick to.",
  },
  {
    title: "Project Gallery",
    description: "Filterable cards with cinematic transitions so every build feels like a tiny exhibit.",
    statusLabel: "Next Up",
  },
  {
    title: "Timeline Page",
    description: "Milestones revealed with gentle motion—because process matters just as much as finished pieces.",
  },
  {
    title: "Book Portfolio Sub-site",
    description: "The classic flip-book lives on inside this app with a clear doorway back to its nostalgic interface.",
    statusLabel: "Live",
  },
]

export * from "./timeline"
export * from "./skills"
export * from "./projects"
