import { useState } from "react"
import { Sidebar } from "@/components/Dashboard/Sidebar"
import { TopBar } from "@/components/Dashboard/TopBar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function DashboardSettingsPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  return (
    <div className="min-h-screen bg-[#0B0503] text-[#F2E4DC]">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 space-y-8 bg-[#120906]/60 p-6">
            <header className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Preferences</p>
              <h1 className="text-3xl font-semibold">Settings</h1>
              <p className="text-sm text-[#F2E4DC]/70">Personalize the dashboard feel locally.</p>
            </header>

            <section className="grid gap-6 md:grid-cols-2">
              <PreferenceCard title="Theme" description="Toggle between warm dark and paper mode.">
                <div className="flex items-center gap-3">
                  <Switch id="theme" checked={darkMode} onChange={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode" />
                  <Label htmlFor="theme">Dark mode</Label>
                </div>
                <div className="mt-4 flex gap-3">
                  <span className={`h-16 flex-1 rounded-2xl ${darkMode ? "bg-[#2E1F1B]" : "bg-[#F2E4DC]"}`} />
                  <span className={`h-16 flex-1 rounded-2xl ${darkMode ? "bg-[#5E4B43]" : "bg-[#C8B4A8]"}`} />
                </div>
              </PreferenceCard>

              <PreferenceCard title="Motion" description="Respect system-level reduced motion preferences.">
                <div className="flex items-center gap-3">
                  <Switch id="motion" checked={reducedMotion} onChange={() => setReducedMotion(!reducedMotion)} aria-label="Toggle reduced motion" />
                  <Label htmlFor="motion">Reduced motion</Label>
                </div>
                <p className="mt-3 text-xs text-[#F2E4DC]/60">Animations will soften when enabled.</p>
              </PreferenceCard>
            </section>

            <section className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
              <p className="text-sm text-[#F2E4DC]/80">Preferences are stored locally only for the session. No remote sync occurs.</p>
              <Button variant="outline" className="mt-4 border-[#5E4B43]/40 text-[#F2E4DC]">
                Save changes
              </Button>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

function PreferenceCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#5E4B43]/40 bg-[#1B120D] p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{title}</p>
      <p className="text-sm text-[#F2E4DC]/70">{description}</p>
      <div className="mt-4 space-y-3 text-sm text-[#F2E4DC]">{children}</div>
    </div>
  )
}
