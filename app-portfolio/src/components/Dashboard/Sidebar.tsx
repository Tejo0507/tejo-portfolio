import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LayoutGrid, BarChart3, BadgeCheck, Cpu, Layers, Settings, PanelsTopLeft, ChevronsLeft } from "lucide-react"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const links = [
  { to: "/dashboard", label: "Overview", icon: <LayoutGrid className="h-4 w-4" aria-hidden /> },
  { to: "/dashboard/projects", label: "Projects", icon: <BarChart3 className="h-4 w-4" aria-hidden /> },
  { to: "/dashboard/skills", label: "Skills", icon: <BadgeCheck className="h-4 w-4" aria-hidden /> },
  { to: "/dashboard/ai-lab", label: "AI Lab", icon: <Cpu className="h-4 w-4" aria-hidden /> },
  { to: "/dashboard/widgets", label: "Systems", icon: <Layers className="h-4 w-4" aria-hidden /> },
  { to: "/dashboard/settings", label: "Settings", icon: <Settings className="h-4 w-4" aria-hidden /> },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`flex h-full flex-col gap-6 border-r border-[#5E4B43]/40 bg-[#120906]/95 p-4 text-[#F2E4DC] transition-[width] ${collapsed ? "w-20" : "w-64"}`}
      aria-label="Dashboard navigation"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PanelsTopLeft className="h-6 w-6" aria-hidden />
          {!collapsed && <p className="text-sm font-semibold uppercase tracking-[0.3em]">Control</p>}
        </div>
        <Button variant="ghost" size="icon" aria-label="Toggle sidebar" onClick={onToggle}>
          <ChevronsLeft className={`h-4 w-4 transition ${collapsed ? "rotate-180" : "rotate-0"}`} />
        </Button>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5E4B43] ${
                isActive ? "border-[#5E4B43]/70 bg-[#2E1F1B]" : "hover:border-[#5E4B43]/40"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {link.icon}
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
