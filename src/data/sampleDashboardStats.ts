export type TrendDirection = "up" | "down"

export interface StatSnapshot {
  id: string
  label: string
  value: string
  delta: number
  trend: TrendDirection
  caption: string
}

export interface DashboardStats {
  projectViews: StatSnapshot
  aiLabUses: StatSnapshot
  snippetUses: StatSnapshot
  avgSession: StatSnapshot
  skillXp: StatSnapshot
}

export interface WeeklyActivityPoint {
  week: string
  visits: number
  aiLab: number
  creations: number
}

export interface ProjectCategoryDatum {
  category: string
  views: number
}

export interface SkillMaturityDatum {
  skill: string
  maturity: number
}

export interface ShortcutLink {
  id: string
  label: string
  description: string
  href: string
  icon: string
}

export const dashboardStats: DashboardStats = {
  projectViews: {
    id: "stat-project-views",
    label: "Total project views",
    value: "182.4K",
    delta: 12,
    trend: "up",
    caption: "Monthly visitors",
  },
  aiLabUses: {
    id: "stat-ai-lab",
    label: "AI Lab tool uses",
    value: "4,392",
    delta: 5,
    trend: "up",
    caption: "Interactions this quarter",
  },
  snippetUses: {
    id: "stat-snippets",
    label: "Snippet vault usage",
    value: "1,118",
    delta: -3,
    trend: "down",
    caption: "Copies this month",
  },
  avgSession: {
    id: "stat-session",
    label: "Average session",
    value: "6m 42s",
    delta: 8,
    trend: "up",
    caption: "Per returning visitor",
  },
  skillXp: {
    id: "stat-skill",
    label: "Skill XP level",
    value: "78%",
    delta: 2,
    trend: "up",
    caption: "Proficiency maturity",
  },
}

export const weeklyActivity: WeeklyActivityPoint[] = [
  { week: "Week 1", visits: 420, aiLab: 92, creations: 18 },
  { week: "Week 2", visits: 505, aiLab: 110, creations: 21 },
  { week: "Week 3", visits: 488, aiLab: 134, creations: 24 },
  { week: "Week 4", visits: 560, aiLab: 150, creations: 26 },
  { week: "Week 5", visits: 590, aiLab: 162, creations: 29 },
  { week: "Week 6", visits: 630, aiLab: 170, creations: 31 },
]

export const projectCategoryData: ProjectCategoryDatum[] = [
  { category: "Web", views: 52 },
  { category: "AI", views: 24 },
  { category: "IoT", views: 12 },
  { category: "Systems", views: 18 },
  { category: "Tooling", views: 14 },
]

export const skillMaturityData: SkillMaturityDatum[] = [
  { skill: "Frontend", maturity: 86 },
  { skill: "AI Lab", maturity: 72 },
  { skill: "Systems", maturity: 64 },
  { skill: "DevOps", maturity: 58 },
]

export const dashboardShortcuts: ShortcutLink[] = [
  {
    id: "shortcut-ai-lab",
    label: "AI Lab",
    description: "Launch experiments",
    href: "/ai-lab",
    icon: "cpu",
  },
  {
    id: "shortcut-snippets",
    label: "Snippets Vault",
    description: "Reuse helpers",
    href: "/snippets",
    icon: "code",
  },
  {
    id: "shortcut-projects",
    label: "Projects",
    description: "View builds",
    href: "/projects",
    icon: "folderKanban",
  },
  {
    id: "shortcut-resume",
    label: "Resume",
    description: "Download CV",
    href: "/resume.pdf",
    icon: "fileText",
  },
  {
    id: "shortcut-contact",
    label: "Contact",
    description: "Send a note",
    href: "/contact",
    icon: "mail",
  },
]
