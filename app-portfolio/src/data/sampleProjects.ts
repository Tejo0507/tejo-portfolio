export type ProjectVisibility = "published" | "unlisted"

export interface AdminProject {
  id: string
  title: string
  description: string
  tags: string[]
  tech: string[]
  image: string
  repoUrl: string
  demoUrl: string
  createdAt: string
  updatedAt: string
  featured: boolean
  visibility: ProjectVisibility
}

export const sampleProjects: AdminProject[] = [
  {
    id: "proj-mini-os",
    title: "Mini OS",
    description: "A playful desktop composed of bespoke widgets, draggable windows, and session persistence.",
    tags: ["experience", "playful"],
    tech: ["React", "TypeScript", "Framer Motion"],
    image: "/images/projects/mini-os.jpg",
    repoUrl: "https://github.com/tejo0507/mini-os",
    demoUrl: "https://mini-os.tejo.dev",
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-11-05T16:00:00Z",
    featured: true,
    visibility: "published",
  },
  {
    id: "proj-snippets",
    title: "Snippets Vault",
    description: "An encrypted snippets system with AI search, diff history, and portable exports.",
    tags: ["tooling", "productivity"],
    tech: ["React", "Zustand", "Tailwind"],
    image: "/images/projects/snippets.jpg",
    repoUrl: "https://github.com/tejo0507/snippets-vault",
    demoUrl: "https://snippets.tejo.dev",
    createdAt: "2024-09-19T12:00:00Z",
    updatedAt: "2025-10-31T08:00:00Z",
    featured: true,
    visibility: "published",
  },
  {
    id: "proj-ai-lab",
    title: "AI Lab",
    description: "Interactive lab of creative ML tools, from KMeans visualizers to sound stylers.",
    tags: ["ai", "lab"],
    tech: ["Vite", "TypeScript", "WebGL"],
    image: "/images/projects/ai-lab.jpg",
    repoUrl: "https://github.com/tejo0507/ai-lab",
    demoUrl: "https://ai-lab.tejo.dev",
    createdAt: "2024-11-02T14:00:00Z",
    updatedAt: "2025-09-21T10:00:00Z",
    featured: false,
    visibility: "published",
  },
  {
    id: "proj-atelier",
    title: "Atelier",
    description: "An immersive storytelling portfolio blending book-like layouts with tactile depth.",
    tags: ["portfolio", "design"],
    tech: ["Three.js", "React", "Tailwind"],
    image: "/images/projects/atelier.jpg",
    repoUrl: "https://github.com/tejo0507/atelier",
    demoUrl: "https://atelier.tejo.dev",
    createdAt: "2023-05-06T10:00:00Z",
    updatedAt: "2025-07-11T11:00:00Z",
    featured: false,
    visibility: "unlisted",
  },
]
