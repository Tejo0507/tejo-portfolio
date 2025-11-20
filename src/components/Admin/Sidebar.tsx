import { NavLink } from "react-router-dom"
import { LayoutDashboard, FolderKanban, Sparkles, Wrench, MessageSquare, Settings, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Skills", href: "/admin/skills", icon: Wrench },
  { label: "Snippets", href: "/admin/snippets", icon: Code2 },
  { label: "AI Lab", href: "/admin/ai-lab", icon: Sparkles },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[#5E4B43]/30 bg-[#120906]/90 text-[#F2E4DC] shadow-2xl backdrop-blur",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className="flex items-center justify-between px-5 py-6">
        <div className={cn("space-y-1", collapsed && "hidden")}
          aria-label="Admin identity"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-[#F2E4DC]/60">Admin</p>
          <p className="text-lg font-semibold">Portfolio Studio</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="border-[#5E4B43]/40 text-[#F2E4DC]"
          onClick={onToggle}
        >
          {collapsed ? "»" : "«"}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-[#5E4B43] text-[#120906] shadow-lg"
                  : "text-[#F2E4DC]/70 hover:bg-[#2E1F1B]/60 hover:text-[#F2E4DC]",
                collapsed && "justify-center px-3"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span className={cn("truncate", collapsed && "sr-only")}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-5 pb-6">
        <div className={cn("rounded-2xl border border-[#5E4B43]/40 p-4 text-xs text-[#F2E4DC]/70", collapsed && "hidden")}
          aria-live="polite"
        >
          <p className="font-semibold text-[#F2E4DC]">Session tips</p>
          <p>Press N to create, Ctrl+S to save, Delete to archive.</p>
        </div>
      </div>
    </aside>
  )
}
