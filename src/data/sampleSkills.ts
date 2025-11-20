export type SkillLevel = "beginner" | "intermediate" | "advanced"

export interface SkillTimelinePoint {
  id: string
  label: string
  delta: number
  note: string
}

export interface SkillItem {
  id: string
  name: string
  level: SkillLevel
  progress: number
  category: string
  latestUpdate: string
  timeline: SkillTimelinePoint[]
  recommended: string[]
}

export const sampleSkills: SkillItem[] = [
  {
    id: "skill-frontend",
    name: "Frontend Systems",
    level: "advanced",
    progress: 90,
    category: "Frontend",
    latestUpdate: "2025-11-11T09:00:00Z",
    timeline: [
      { id: "sf-1", label: "Design system polish", delta: 10, note: "Extended shadcn tokens to parchment theme." },
      { id: "sf-2", label: "Accessibility sprint", delta: 6, note: "Mapped new shortcuts, improved focus rings." },
      { id: "sf-3", label: "Motion audit", delta: 4, note: "Aligned transitions with prefers-reduced-motion." },
    ],
    recommended: ["WebGPU flourishes", "Native bridging"],
  },
  {
    id: "skill-ai",
    name: "AI Lab Craft",
    level: "advanced",
    progress: 82,
    category: "AI/ML",
    latestUpdate: "2025-11-09T15:30:00Z",
    timeline: [
      { id: "sa-1", label: "Clustering suite", delta: 8, note: "Released centroid scrubber." },
      { id: "sa-2", label: "Prompt design", delta: 5, note: "Documented 20+ reusable templates." },
      { id: "sa-3", label: "Agents", delta: 3, note: "Hooked admin automation worker." },
    ],
    recommended: ["On-device RAG", "Realtime audio agents"],
  },
  {
    id: "skill-backend",
    name: "Backend Craft",
    level: "intermediate",
    progress: 65,
    category: "Backend",
    latestUpdate: "2025-11-05T11:10:00Z",
    timeline: [
      { id: "sb-1", label: "Edge adapters", delta: 5, note: "Refined D1/KV connectors." },
      { id: "sb-2", label: "Auth flows", delta: 7, note: "Designed mock admin gate." },
    ],
    recommended: ["WASM data workers", "Resilient feature flags"],
  },
  {
    id: "skill-devops",
    name: "DevOps Craft",
    level: "intermediate",
    progress: 56,
    category: "Ops",
    latestUpdate: "2025-10-29T13:40:00Z",
    timeline: [
      { id: "sd-1", label: "Pipelines", delta: 6, note: "Consolidated preview deploys." },
      { id: "sd-2", label: "Observability", delta: 4, note: "Hooked Vercel analytics stream." },
    ],
    recommended: ["K8s blueprints", "Policy as code"],
  },
  {
    id: "skill-creative",
    name: "Creative Coding",
    level: "beginner",
    progress: 44,
    category: "Experimental",
    latestUpdate: "2025-10-20T08:00:00Z",
    timeline: [
      { id: "sc-1", label: "Particles", delta: 5, note: "Optimized universe canvas." },
      { id: "sc-2", label: "Shaders", delta: 3, note: "Tested parchment fresnel." },
    ],
    recommended: ["Audio-reactive scenes", "AR postcards"],
  },
]
