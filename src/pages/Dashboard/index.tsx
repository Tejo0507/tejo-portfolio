import { lazy, Suspense, useMemo, useState } from "react"
import { useDashboardStore } from "@/store/dashboardStore"
import { Sidebar } from "@/components/Dashboard/Sidebar"
import { TopBar } from "@/components/Dashboard/TopBar"
import { StatCard } from "@/components/Dashboard/StatCard"
import { ActivityTimeline } from "@/components/Dashboard/ActivityTimeline"
import { SkillCard } from "@/components/Dashboard/SkillCard"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Cpu, Eye, Code2, TimerReset, Award, Loader2 } from "lucide-react"

const GraphLine = lazy(() => import("@/components/Dashboard/GraphLine").then((mod) => ({ default: mod.GraphLine })))
const GraphBar = lazy(() => import("@/components/Dashboard/GraphBar").then((mod) => ({ default: mod.GraphBar })))
const GraphRadial = lazy(() => import("@/components/Dashboard/GraphRadial").then((mod) => ({ default: mod.GraphRadial })))

export default function DashboardHomePage() {
  const [collapsed, setCollapsed] = useState(false)
  const stats = useDashboardStore((state) => state.stats)
  const shortcuts = useDashboardStore((state) => state.shortcuts)
  const weeklyActivity = useDashboardStore((state) => state.weeklyActivity)
  const categories = useDashboardStore((state) => state.projectCategories)
  const skillMaturity = useDashboardStore((state) => state.skillMaturity)
  const skills = useDashboardStore((state) => state.skills)
  const navigate = useNavigate()

  const statList = useMemo(
    () => [
      { ...stats.projectViews, icon: <Eye className="h-5 w-5" /> },
      { ...stats.aiLabUses, icon: <Cpu className="h-5 w-5" /> },
      { ...stats.snippetUses, icon: <Code2 className="h-5 w-5" /> },
      { ...stats.avgSession, icon: <TimerReset className="h-5 w-5" /> },
      { ...stats.skillXp, icon: <Award className="h-5 w-5" /> },
    ],
    [stats]
  )

  return (
    <div className="min-h-screen bg-[#0B0503] text-[#F2E4DC]">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 space-y-8 bg-[#120906]/60 p-6">
            <header className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Dashboard</p>
              <h1 className="text-3xl font-semibold">Control center</h1>
              <p className="text-sm text-[#F2E4DC]/70">Track visits, iterate on projects, and peek into AI experiments from one warm cockpit.</p>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {statList.map((card) => (
                <StatCard key={card.id} {...card} />
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Weekly activity</p>
                    <p className="text-sm text-[#F2E4DC]/70">Visitors vs AI Lab launches</p>
                  </div>
                </div>
                <Suspense fallback={<ChartFallback label="Loading activity" />}>
                  <GraphLine data={weeklyActivity} />
                </Suspense>
              </div>
              <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Shortcut orbit</p>
                    <p className="text-sm text-[#F2E4DC]/70">Jump into focused tools</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {shortcuts.map((shortcut) => (
                    <button
                      key={shortcut.id}
                      type="button"
                      onClick={() => navigate(shortcut.href)}
                      className="flex items-center justify-between rounded-2xl border border-[#5E4B43]/30 bg-[#120906] px-4 py-3 text-left transition hover:border-[#F2E4DC]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5E4B43]"
                      aria-label={`Open ${shortcut.label}`}
                    >
                      <div>
                        <p className="text-sm font-medium">{shortcut.label}</p>
                        <p className="text-xs text-[#F2E4DC]/60">{shortcut.description}</p>
                      </div>
                      <span aria-hidden>↗</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6 lg:col-span-2">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Project categories</p>
                <Suspense fallback={<ChartFallback label="Loading categories" />}>
                  <GraphBar data={categories} />
                </Suspense>
              </div>
              <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Skill maturity</p>
                <Suspense fallback={<ChartFallback label="Loading skills" />}>
                  <GraphRadial data={skillMaturity} />
                </Suspense>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
                <ActivityTimeline />
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Skills focus</p>
                <div className="space-y-4">
                  {skills.slice(0, 2).map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full border-[#5E4B43]/40 text-[#F2E4DC]"
                  onClick={() => navigate("/dashboard/skills")}
                >
                  View full skills dashboard
                </Button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

function ChartFallback({ label }: { label: string }) {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-[#F2E4DC]/60">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {label}
    </div>
  )
}
