import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useAiLabStore, type AiToolId } from "@/store/aiLabStore"

interface SidebarItem {
  id: AiToolId
  title: string
  summary: string
}

interface SidebarProps {
  items: SidebarItem[]
}

export function Sidebar({ items }: SidebarProps) {
  const selectedTool = useAiLabStore((state) => state.selectedTool)

  return (
    <nav aria-label="AI Lab tools" className="space-y-3">
      {items.map((item) => {
        const isActive = selectedTool === item.id
        return (
          <motion.div key={item.id} layout className="rounded-2xl border border-[#5E4B43]/30 bg-[#2E1F1B]/30">
            <NavLink
              to={`/ai-lab/${item.id}`}
              className={`flex items-start justify-between rounded-2xl p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5E4B43] ${
                isActive ? "bg-[#5E4B43]/30" : "hover:bg-[#5E4B43]/10"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-[#F6F3F0]">{item.title}</p>
                <p className="text-xs text-[#d8cdc6]/80">{item.summary}</p>
              </div>
              <ArrowUpRight className="mt-1 h-4 w-4 text-[#d8cdc6]/70" aria-hidden="true" />
            </NavLink>
          </motion.div>
        )
      })}
    </nav>
  )
}
