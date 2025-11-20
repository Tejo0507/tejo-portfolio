import { useEffect, useMemo } from "react"
import { FolderKanban, Wrench, Code2, Sparkles, MessageSquare, Activity } from "lucide-react"
import { AdminLayout } from "@/components/Admin/AdminLayout"
import { StatCard } from "@/components/Admin/StatCard"
import { useAdminProjectStore } from "@/store/projectStore"
import { useAdminSkillStore } from "@/store/skillStore"
import { useSnippetsAdminStore } from "@/store/snippetsAdminStore"
import { useAiLabAdminStore } from "@/store/aiLabAdminStore"
import { useMessagesStore } from "@/store/messagesStore"
import { useAdminSettings } from "@/store/adminSettings"
import { getActivityLog } from "@/utils/activityLog"

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return tag === "input" || tag === "textarea" || target.isContentEditable
}

export default function AdminDashboardPage() {
  const projects = useAdminProjectStore((state) => state.projects)
  const createProject = useAdminProjectStore((state) => state.createProject)
  const setProjectDrawer = useAdminProjectStore((state) => state.toggleDrawer)
  const skills = useAdminSkillStore((state) => state.skills)
  const snippets = useSnippetsAdminStore((state) => state.snippets)
  const aiTools = useAiLabAdminStore((state) => state.tools)
  const messages = useMessagesStore((state) => state.messages)
  const { widgetToggles } = useAdminSettings()
  const activities = getActivityLog()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      if (event.key.toLowerCase() === "n" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        createProject()
        setProjectDrawer(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [createProject, setProjectDrawer])

  const stats = useMemo(
    () => [
      { label: "Projects", value: projects.length.toString(), delta: "+3 this week", icon: <FolderKanban className="h-5 w-5" /> },
      { label: "Skills", value: skills.length.toString(), delta: "+1 focus", icon: <Wrench className="h-5 w-5" /> },
      { label: "Snippets", value: snippets.length.toString(), delta: "+6 curated", icon: <Code2 className="h-5 w-5" /> },
      { label: "AI tools", value: aiTools.length.toString(), delta: "+2 protos", icon: <Sparkles className="h-5 w-5" /> },
      { label: "Messages", value: messages.length.toString(), delta: "2 unread", icon: <MessageSquare className="h-5 w-5" /> },
    ],
    [projects.length, skills.length, snippets.length, aiTools.length, messages.length]
  )

  return (
    <AdminLayout title="Admin overview">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D]/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Quick actions</p>
              <h2 className="text-2xl font-semibold">Workflows</h2>
            </div>
            <Activity className="h-5 w-5 text-[#F2E4DC]/60" />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <QuickAction
              label="New project"
              description="Spin up a fresh entry, set tags, drop mock cover."
              shortcut="N"
              onClick={() => {
                createProject()
                setProjectDrawer(true)
              }}
            />
            <QuickAction label="Record skill" description="Log progress bumps" shortcut="S" onClick={() => document.dispatchEvent(new CustomEvent("admin-skill-new"))} />
            <QuickAction label="Snippets import" description="Sync JSON snapshot" shortcut="Ctrl+I" onClick={() => document.dispatchEvent(new CustomEvent("admin-snippet-import"))} />
            <QuickAction label="AI prompt" description="Add example prompt" shortcut="P" onClick={() => document.dispatchEvent(new CustomEvent("admin-ai-prompt"))} />
          </div>
        </div>

        {widgetToggles.system ? <SystemWidget /> : null}
      </section>

      {widgetToggles.timeline ? (
        <section className="rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D]/80 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Recent activity</p>
          <ul className="mt-6 space-y-4">
            {activities.slice(0, 8).map((item) => (
              <li key={item.id} className="flex items-start gap-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#5E4B43]" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-[#F2E4DC]">{item.label}</p>
                  <p className="text-sm text-[#F2E4DC]/70">{item.description}</p>
                  <p className="text-xs text-[#F2E4DC]/40">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </AdminLayout>
  )
}

function QuickAction({ label, description, shortcut, onClick }: { label: string; description: string; shortcut: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-[#5E4B43]/30 bg-[#120906]/70 px-4 py-4 text-left transition hover:border-[#5E4B43]/60"
    >
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-[#F2E4DC]">{label}</p>
        <span className="rounded-full border border-[#5E4B43]/40 px-2 py-0.5 text-xs text-[#F2E4DC]/80">{shortcut}</span>
      </div>
      <p className="text-sm text-[#F2E4DC]/70">{description}</p>
    </button>
  )
}

function SystemWidget() {
  const { theme, accent, notificationsEnabled } = useAdminSettings()
  return (
    <div className="rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D]/80 p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">System widgets</p>
      <div className="mt-4 space-y-4 text-sm text-[#F2E4DC]/80">
        <p>
          Theme: <span className="font-semibold text-[#F2E4DC]">{theme}</span>
        </p>
        <p>
          Accent: <span className="font-semibold text-[#F2E4DC]">{accent}</span>
        </p>
        <p>
          Notifications: <span className="font-semibold text-[#F2E4DC]">{notificationsEnabled ? "Enabled" : "Muted"}</span>
        </p>
      </div>
    </div>
  )
}
