import { Search, Bell, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  onSearch?: (value: string) => void
}

export function TopBar({ onSearch }: TopBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#5E4B43]/30 bg-[#120906]/80 px-6 py-4 text-[#F2E4DC]">
      <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#5E4B43]/30 bg-[#1B120D] px-3 py-2">
        <Search className="h-4 w-4 text-[#F2E4DC]/60" aria-hidden />
        <Input
          type="search"
          placeholder="Search dashboard actions"
          className="border-none bg-transparent text-sm text-[#F2E4DC] focus-visible:ring-0"
          onChange={(event) => onSearch?.(event.target.value)}
          aria-label="Search dashboard"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="border-[#5E4B43]/40 bg-transparent text-[#F2E4DC]" aria-label="Profile">
          <User className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Tejo</span>
        </Button>
      </div>
    </header>
  )
}
