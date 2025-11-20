import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { Sidebar } from "@/components/Dashboard/Sidebar"
import { TopBar } from "@/components/Dashboard/TopBar"
import { useDashboardStore } from "@/store/dashboardStore"
import { Cpu, Grid, Activity } from "lucide-react"

const heatmap = [
  [4, 6, 2, 7, 5, 3, 1],
  [5, 8, 3, 6, 7, 4, 2],
  [2, 5, 1, 4, 3, 2, 1],
  [6, 9, 5, 8, 7, 6, 4],
]

export default function AiLabInsightsPage() {
  const [collapsed, setCollapsed] = useState(false)
  const stats = useDashboardStore((state) => state.stats)
  const activity = useDashboardStore((state) => state.activity)

  const mostUsedTool = useMemo(() => activity.find((item) => item.type === "ai")?.title ?? "Visualizer" , [activity])

  return (
    <div className="min-h-screen bg-[#0B0503] text-[#F2E4DC]">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 space-y-8 bg-[#120906]/60 p-6">
            <header className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">AI Lab insights</p>
              <h1 className="text-3xl font-semibold">Experiment telemetry</h1>
              <p className="text-sm text-[#F2E4DC]/70">Watch tool usage patterns and compute budgets.</p>
            </header>
            <section className="grid gap-4 md:grid-cols-3">
              <InsightCard label="Most-used tool" value={mostUsedTool} icon={<Cpu className="h-4 w-4" />} />
              <InsightCard label="Total interactions" value={stats.aiLabUses.value} icon={<Grid className="h-4 w-4" />} />
              <InsightCard label="Avg session" value={stats.avgSession.value} icon={<Activity className="h-4 w-4" />} />
            </section>
            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Weekly usage heatmap</p>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {heatmap.flatMap((row, rowIndex) =>
                    row.map((value, colIndex) => (
                      <span
                        key={`${rowIndex}-${colIndex}`}
                        className="h-10 rounded-xl"
                        style={{
                          backgroundColor: `rgba(94,75,67,${0.2 + value / 12})`,
                        }}
                        aria-label={`Day ${colIndex + 1} slot ${rowIndex + 1}: ${value} sessions`}
                        tabIndex={0}
                      />
                    ))
                  )}
                </div>
                <p className="mt-3 text-xs text-[#F2E4DC]/60">Darker blocks mean more AI Lab interactions.</p>
              </article>
              <article className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Compute time estimate</p>
                <div className="mt-6 flex items-end gap-6">
                  <div className="flex-1">
                    <div className="h-40 rounded-2xl border border-[#5E4B43]/30 bg-[#120906]">
                      <div className="h-full rounded-2xl bg-gradient-to-b from-[#F2E4DC] to-[#5E4B43]" style={{ height: "68%" }} />
                    </div>
                    <p className="mt-2 text-sm text-[#F2E4DC]/80">68 GPU-min this week</p>
                  </div>
                  <div className="space-y-1 text-sm text-[#F2E4DC]/80">
                    <p>Tokenizer • 18%</p>
                    <p>KMeans • 26%</p>
                    <p>PCA • 14%</p>
                    <p>Matrix tools • 10%</p>
                  </div>
                </div>
              </article>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

function InsightCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-4">
      <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{label}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <span className="text-[#F2E4DC]/60">{icon}</span>
    </div>
  )
}
