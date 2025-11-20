import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { AdminLayout } from "@/components/Admin/AdminLayout"
import { ConfirmDialog } from "@/components/Admin/ConfirmDialog"
import { useAdminSettings } from "@/store/adminSettings"
import { useAdminProjectStore } from "@/store/projectStore"
import { useAdminSkillStore } from "@/store/skillStore"
import { useSnippetsAdminStore, type SnippetFolder } from "@/store/snippetsAdminStore"
import { useAiLabAdminStore } from "@/store/aiLabAdminStore"
import { useMessagesStore, type AdminMessageWithReply } from "@/store/messagesStore"
import type { AdminProject } from "@/data/sampleProjects"
import type { SkillItem } from "@/data/sampleSkills"
import type { AdminAiTool } from "@/data/sampleAiTools"
import type { Snippet } from "@/types/snippet"
import { exportState, importState, getLastBackup } from "@/utils/localBackup"

interface AdminBackupPayload {
  projects: AdminProject[]
  skills: SkillItem[]
  snippets: { folders: SnippetFolder[]; snippets: Snippet[] }
  aiTools: AdminAiTool[]
  messages: AdminMessageWithReply[]
}

const themes: Array<{ id: "brown" | "light" | "dark"; label: string }> = [
  { id: "brown", label: "Parchment" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Night" },
]

export default function AdminSettingsPage() {
  const {
    theme,
    setTheme,
    accent,
    setAccent,
    widgetToggles,
    toggleWidget,
    quickActions,
    setQuickActions,
    notificationsEnabled,
    toggleNotifications,
    recordExport,
    lastExportedAt,
    resetDashboardWidgets,
    resetAllData,
  } = useAdminSettings()

  const projects = useAdminProjectStore((state) => state.projects)
  const importProjects = useAdminProjectStore((state) => state.importProjects)
  const skills = useAdminSkillStore((state) => state.skills)
  const importSkills = useAdminSkillStore((state) => state.importSkills)
  const snippetFolders = useSnippetsAdminStore((state) => state.folders)
  const snippetList = useSnippetsAdminStore((state) => state.snippets)
  const importSnippets = useSnippetsAdminStore((state) => state.importSnapshot)
  const aiTools = useAiLabAdminStore((state) => state.tools)
  const importTools = useAiLabAdminStore((state) => state.importTools)
  const messageList = useMessagesStore((state) => state.messages)
  const importMessages = useMessagesStore((state) => state.importMessages)

  const [pendingReset, setPendingReset] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const lastBackup = useMemo(() => lastExportedAt ?? getLastBackup()?.exportedAt ?? null, [lastExportedAt])

  const handleExport = () => {
    const payload: AdminBackupPayload = {
      projects,
      skills,
      snippets: { folders: snippetFolders, snippets: snippetList },
      aiTools,
      messages: messageList,
    }
    exportState(payload)
    recordExport()
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const data = await importState<AdminBackupPayload>(file)
      importProjects(data.projects)
      importSkills(data.skills)
      importSnippets(data.snippets.folders, data.snippets.snippets)
      importTools(data.aiTools)
      importMessages(data.messages)
      setImportError(null)
    } catch (error) {
      setImportError("Failed to import backup. Please verify the file format.")
      console.error(error)
    } finally {
      event.target.value = ""
    }
  }

  const handleActionChange = (index: number, value: string) => {
    const next = quickActions.map((action, idx) => (idx === index ? value : action))
    setQuickActions(next)
  }

  const handleAddAction = () => {
    setQuickActions([...quickActions, "New action"])
  }

  const handleRemoveAction = (index: number) => {
    if (quickActions.length === 1) return
    setQuickActions(quickActions.filter((_, idx) => idx !== index))
  }

  return (
    <AdminLayout title="Settings">
      <section className="grid gap-4 md:grid-cols-3">
        {themes.map((entry) => (
          <button
            type="button"
            key={entry.id}
            onClick={() => setTheme(entry.id)}
            className={`rounded-3xl border p-4 text-left ${
              theme === entry.id
                ? "border-[#5E4B43] bg-[#5E4B43]/20 text-[#F2E4DC]"
                : "border-[#5E4B43]/30 bg-[#120906]/60 text-[#F2E4DC]/70"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.35em]">Theme</p>
            <p className="text-2xl font-semibold">{entry.label}</p>
            <p className="text-xs text-[#F2E4DC]/60">Click to apply</p>
          </button>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/80 p-5">
          <h3 className="text-lg font-semibold text-[#F2E4DC]">Accent color</h3>
          <p className="text-sm text-[#F2E4DC]/70">Tints apply to buttons, outlines, and glow.</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={accent}
              onChange={(event) => setAccent(event.target.value)}
              className="h-12 w-12 rounded-2xl border border-[#5E4B43]/40 bg-transparent"
            />
            <Input value={accent} onChange={(event) => setAccent(event.target.value)} className="max-w-[160px]" />
          </div>
          <Button variant="ghost" className="text-[#F2E4DC]/70" onClick={resetDashboardWidgets}>
            Reset widget layout
          </Button>
        </div>

        <div className="space-y-4 rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/80 p-5">
          <h3 className="text-lg font-semibold text-[#F2E4DC]">Notifications</h3>
          <p className="text-sm text-[#F2E4DC]/70">Enable toast alerts for admin events.</p>
          <Button className="bg-[#5E4B43] text-[#120906]" onClick={toggleNotifications}>
            {notificationsEnabled ? "Disable" : "Enable"} notifications
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/80 p-5">
        <h3 className="text-lg font-semibold text-[#F2E4DC]">Widgets</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Object.entries(widgetToggles).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between rounded-2xl border border-[#5E4B43]/30 px-4 py-3 text-sm">
              <span className="text-[#F2E4DC]">{key}</span>
              <Switch checked={value} onChange={() => toggleWidget(key)} aria-checked={value} />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/80 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#F2E4DC]">Quick actions</h3>
          <Button variant="ghost" className="text-[#F2E4DC]/70" onClick={handleAddAction}>
            Add action
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {quickActions.map((action, index) => (
            <div key={`${action}-${index}`} className="flex items-center gap-3">
              <Input value={action} onChange={(event) => handleActionChange(index, event.target.value)} />
              <Button variant="ghost" className="text-rose-300" onClick={() => handleRemoveAction(index)} disabled={quickActions.length === 1}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/80 p-5">
          <h3 className="text-lg font-semibold text-[#F2E4DC]">Backups</h3>
          <p className="text-sm text-[#F2E4DC]/70">Export every admin dataset as a portable JSON snapshot.</p>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-[#5E4B43] text-[#120906]" onClick={handleExport}>
              Export data
            </Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-[#5E4B43]/40 px-4 py-2 text-sm text-[#F2E4DC]/80">
              Import backup
              <input type="file" accept="application/json" className="sr-only" onChange={handleImport} />
            </label>
          </div>
          {lastBackup ? <p className="text-xs text-[#F2E4DC]/60">Last export {new Date(lastBackup).toLocaleString()}</p> : null}
          {importError ? <p className="text-xs text-rose-300">{importError}</p> : null}
        </div>

        <div className="space-y-4 rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/80 p-5">
          <h3 className="text-lg font-semibold text-[#F2E4DC]">Danger zone</h3>
          <p className="text-sm text-[#F2E4DC]/70">Reset all admin data, keyboard preferences, and activity logs.</p>
          <Button variant="outline" className="border-rose-400/40 text-rose-200" onClick={() => setPendingReset(true)}>
            Reset everything
          </Button>
        </div>
      </section>

      <ConfirmDialog
        open={pendingReset}
        title="Reset admin data?"
        description="This clears every admin store, activity log, and backup reference."
        confirmLabel="Reset"
        destructive
        onConfirm={() => {
          resetAllData()
          setPendingReset(false)
        }}
        onCancel={() => setPendingReset(false)}
      />
    </AdminLayout>
  )
}
