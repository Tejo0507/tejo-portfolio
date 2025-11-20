import { useMemo, useState } from "react"
import { Sidebar } from "@/components/Dashboard/Sidebar"
import { TopBar } from "@/components/Dashboard/TopBar"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { FolderKanban, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"

const categories = ["All", "Web", "AI", "Systems", "Tooling"]

const projectViewsOverTime = [
  { label: "Apr", views: 420 },
  { label: "May", views: 460 },
  { label: "Jun", views: 512 },
  { label: "Jul", views: 570 },
  { label: "Aug", views: 640 },
  { label: "Sep", views: 710 },
]

const techStackDistribution = [
  { name: "React", value: 32 },
  { name: "TypeScript", value: 26 },
  { name: "Python", value: 18 },
  { name: "Rust", value: 14 },
  { name: "Other", value: 10 },
]

const sampleProjects = [
  { id: "p1", title: "Neural Canvas", category: "AI", views: 12800, interactions: 980, trend: 12 },
  { id: "p2", title: "Mini OS", category: "Systems", views: 8600, interactions: 720, trend: 8 },
  { id: "p3", title: "Portfolio OS", category: "Web", views: 15400, interactions: 1100, trend: 15 },
  { id: "p4", title: "Snippets Vault", category: "Tooling", views: 9400, interactions: 640, trend: 5 },
]

const pieColors = ["#5E4B43", "#F2E4DC", "#B28A78", "#836355", "#412B22"]

export default function ProjectsAnalyticsPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [category, setCategory] = useState("All")
  const navigate = useNavigate()

  const filteredProjects = useMemo(
    () => (category === "All" ? sampleProjects : sampleProjects.filter((project) => project.category === category)),
    [category]
  )

  return (
    <div className="min-h-screen bg-[#0B0503] text-[#F2E4DC]">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 space-y-8 bg-[#120906]/60 p-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Projects analytics</p>
                <h1 className="text-3xl font-semibold">Engagement & reach</h1>
              </div>
              <Button className="bg-[#5E4B43] text-[#120906]" onClick={() => navigate("/projects")}>
                View public gallery
              </Button>
            </header>

            <section className="flex flex-wrap gap-3">
              {categories.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setCategory(entry)}
                  className={`rounded-full border px-4 py-1 text-sm transition ${
                    category === entry ? "border-[#F2E4DC] bg-[#2E1F1B]" : "border-[#5E4B43]/40 text-[#F2E4DC]/70"
                  }`}
                >
                  {entry}
                </button>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <motion.div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                <header className="flex items-center gap-2 text-sm text-[#F2E4DC]/70">
                  <BarChart3 className="h-4 w-4" /> Views over time
                </header>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectViewsOverTime} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,75,67,0.25)" />
                      <XAxis dataKey="label" stroke="rgba(247,230,212,0.6)" tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(247,230,212,0.6)" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#2E1F1B", borderRadius: 12 }} />
                      <Area type="monotone" dataKey="views" stroke="#F2E4DC" fill="#5E4B43" fillOpacity={0.4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="sr-only">Line chart of project views from April to September.</p>
              </motion.div>

              <motion.div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                <header className="flex items-center gap-2 text-sm text-[#F2E4DC]/70">
                  <FolderKanban className="h-4 w-4" /> Tech stack usage
                </header>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={techStackDistribution} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="90%" paddingAngle={2}>
                        {techStackDistribution.map((entry, index) => (
                          <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="sr-only">Pie chart of tech stack usage distribution.</p>
              </motion.div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {filteredProjects.map((project) => (
                <article key={project.id} className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <span className="text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/60">{project.category}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#F2E4DC]/70">{project.views.toLocaleString()} lifetime views</p>
                  <p className="text-xs text-[#F2E4DC]/50">{project.interactions} interactions</p>
                  <p className={`mt-3 text-sm ${project.trend >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                    {project.trend >= 0 ? "↑" : "↓"} {Math.abs(project.trend)}% this month
                  </p>
                </article>
              ))}
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
