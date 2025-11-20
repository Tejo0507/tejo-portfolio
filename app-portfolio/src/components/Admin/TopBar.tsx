import { useState } from "react"
import { Menu, Search, Bell, Lock, Unlock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAdminAuth } from "@/store/adminAuth"
import { useAdminSettings } from "@/store/adminSettings"
import { cn } from "@/utils"

interface TopBarProps {
  collapsed: boolean
  onToggleMenu: () => void
  title?: string
}

export function TopBar({ collapsed, onToggleMenu, title }: TopBarProps) {
  const [query, setQuery] = useState("")
  const { isUnlocked, toggleLockModal, logout } = useAdminAuth()
  const { accent } = useAdminSettings()

  return (
    <header
      className="sticky top-0 z-30 border-b border-[#5E4B43]/30 bg-[#120906]/70 backdrop-blur"
      data-sidebar-collapsed={collapsed}
    >
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 text-[#F2E4DC]">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#F2E4DC]"
          onClick={onToggleMenu}
          aria-label="Toggle sidebar"
          aria-expanded={!collapsed}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex flex-1 items-center gap-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search admin panels"
            className="h-11 rounded-2xl border-[#5E4B43]/40 bg-[#0B0503]/40 text-sm text-[#F2E4DC]"
            aria-label="Search admin entries"
          />
          <Button variant="ghost" size="icon" className="text-[#F2E4DC]" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-[#F2E4DC]" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#F2E4DC]"
            aria-label={isUnlocked ? "Lock admin" : "Unlock admin"}
            onClick={() => (isUnlocked ? (logout(), toggleLockModal(true)) : toggleLockModal(true))}
          >
            {isUnlocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl border border-[#5E4B43]/50 text-sm font-semibold",
              "bg-[#2E1F1B] text-[#F2E4DC]"
            )}
            style={{ boxShadow: `0 0 0 2px ${accent}33` }}
            aria-label="Admin profile"
          >
            TS
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#5E4B43]/20 px-6 py-2 text-xs uppercase tracking-[0.3em] text-[#F2E4DC]/70">
        <p>{title ?? "Studio control"}</p>
        <div className="flex items-center gap-3 text-[0.7rem]">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Quick actions ready
          </span>
          <span className="hidden sm:inline">N → New · Ctrl+S → Save · Delete → Archive</span>
        </div>
      </div>
    </header>
  )
}
