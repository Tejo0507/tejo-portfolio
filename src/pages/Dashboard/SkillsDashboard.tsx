import { lazy, Suspense, useState } from "react"
import { Sidebar } from "@/components/Dashboard/Sidebar"
import { TopBar } from "@/components/Dashboard/TopBar"
import { SkillCard } from "@/components/Dashboard/SkillCard"
import { useDashboardStore } from "@/store/dashboardStore"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLevelLabel } from "@/utils/skillHelpers"

const GraphRadial = lazy(() => import("@/components/Dashboard/GraphRadial").then((mod) => ({ default: mod.GraphRadial })))

export default function SkillsDashboardPage() {
  const [collapsed, setCollapsed] = useState(false)
  const skills = useDashboardStore((state) => state.skills)
  const skillMaturity = useDashboardStore((state) => state.skillMaturity)

  return (
    <div className="min-h-screen bg-[#0B0503] text-[#F2E4DC]">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 space-y-8 bg-[#120906]/60 p-6">
            <header className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Skills dashboard</p>
              <h1 className="text-3xl font-semibold">Progress intelligence</h1>
              <p className="text-sm text-[#F2E4DC]/70">Monitor practice streaks, maturity, and next bets.</p>
            </header>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Proficiency radar</p>
                <Suspense fallback={<ChartFallback label="Loading radar" />}>
                  <GraphRadial data={skillMaturity} />
                </Suspense>
              </div>
              <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Recommended stretch goals</p>
                <ul className="mt-4 space-y-3 text-sm text-[#F2E4DC]/80">
                  {skills.flatMap((skill) => skill.recommended.map((rec) => ({ skill: skill.name, rec }))).map((item) => (
                    <li key={`${item.skill}-${item.rec}`} className="rounded-xl border border-[#5E4B43]/30 px-3 py-2">
                      <strong className="text-[#F2E4DC]">{item.skill}</strong>
                      <span className="ml-2 text-[#F2E4DC]/70">{item.rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Skill journals</p>
                <Button variant="ghost" className="text-[#F2E4DC]/80" aria-label="Export skill log">
                  Export log
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Narrative summary</p>
              <div className="mt-4 space-y-3 text-sm text-[#F2E4DC]/80">
                {skills.map((skill) => (
                  <p key={`${skill.id}-summary`}>
                    {skill.name}: {skill.progress}% ({getLevelLabel(skill.level)}) — {skill.timeline[0]?.note ?? "Keep iterating"}
                  </p>
                ))}
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
